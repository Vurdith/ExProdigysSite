export interface YouTubeChannelData {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  subscriberCount: string;
  avatarUrl: string;
}

export async function getChannelData(urlOrHandle: string): Promise<YouTubeChannelData | null> {
  const fullUrl = buildYouTubeUrl(urlOrHandle);
  
  try {
    const response = await fetch(fullUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) return null;

    const html = await response.text();
    
    // Extract ytInitialData JSON
    const dataMatch = html.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (!dataMatch) return null;

    const json = JSON.parse(dataMatch[1]);
    
    // Extract metadata using deep path navigation
    const metadata = json.metadata?.channelMetadataRenderer || {};
    // Extract avatar from metadata or header
    let avatarUrl = metadata.avatar?.thumbnails?.[0]?.url || "";

    // SUPPORT FOR NEWEST YT UI (Page Header View Model)
    const pageHeader = json.header?.pageHeaderRenderer?.content?.pageHeaderViewModel;
    if (pageHeader?.image?.decoratedAvatarViewModel?.avatar?.avatarViewModel?.image?.sources) {
        const sources = pageHeader.image.decoratedAvatarViewModel.avatar.avatarViewModel.image.sources;
        avatarUrl = sources[sources.length - 1].url;
    } else if (pageHeader?.image?.decoratedAvatarViewModel?.avatar?.avatar?.image?.thumbnails) {
        const pfpThumbnails = pageHeader.image.decoratedAvatarViewModel.avatar.avatar.image.thumbnails;
        avatarUrl = pfpThumbnails[pfpThumbnails.length - 1].url;
    } else if (json.header?.c4TabbedHeaderRenderer?.avatar?.thumbnails) {
        const pfpThumbnails = json.header.c4TabbedHeaderRenderer.avatar.thumbnails;
        avatarUrl = pfpThumbnails[pfpThumbnails.length - 1].url;
    }

    const header = json.header?.c4TabbedHeaderRenderer || json.header?.pageHeaderRenderer?.content?.pageHeaderViewModel || {};
    
    // Title
    const title = metadata.title || pageHeader?.title?.dynamicTextViewModel?.text?.content || "";
    
    // Description
    const description = metadata.description || "";
    
    if (avatarUrl.startsWith("//")) avatarUrl = "https:" + avatarUrl;

    // Subscriber Count
    let subscriberCount = "N/A";
    
    // Support for multiple YouTube UI versions
    const subCountText = 
      header.subscriberCountText?.simpleText || 
      header.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]?.text?.content ||
      "";

    if (subCountText) {
      subscriberCount = subCountText.split(" ")[0];
    } else if (pageHeader?.metadata?.contentMetadataViewModel?.metadataRows) {
        // Nested check for newer UI
        const rows = pageHeader.metadata.contentMetadataViewModel.metadataRows;
        for (const row of rows) {
            const text = row.metadataParts?.[0]?.text?.content || "";
            if (text.toLowerCase().includes("subscribers")) {
                subscriberCount = text.split(" ")[0];
                break;
            }
        }
    }

    return {
      id: metadata.externalId || "",
      title,
      description,
      customUrl: metadata.ownerUrls?.[0] || fullUrl,
      subscriberCount,
      avatarUrl,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return null;
  }
}

function buildYouTubeUrl(input: string): string {
  const cleanInput = input.trim();
  
  if (cleanInput.startsWith("http")) return cleanInput;
  if (cleanInput.startsWith("@")) return `https://www.youtube.com/${cleanInput}`;
  
  // Default to handle if no protocol and no @
  return `https://www.youtube.com/@${cleanInput}`;
}
