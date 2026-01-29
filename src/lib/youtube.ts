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
    const header = json.header?.c4TabbedHeaderRenderer || json.header?.pageHeaderRenderer?.content?.pageHeaderViewModel || {};
    
    // Title
    const title = metadata.title || "";
    
    // Description
    const description = metadata.description || "";
    
    // Avatar Extraction
    let avatarUrl = "";
    
    // Try multiple possible paths for the avatar (YouTube frequently changes these)
    const possibleAvatarPaths = [
      metadata.avatar?.thumbnails,
      header.avatar?.thumbnails,
      header.profilePic?.thumbnails,
      header.image?.decoratedAvatarViewModel?.avatar?.avatar?.image?.thumbnails,
      json.header?.pageHeaderRenderer?.content?.pageHeaderViewModel?.image?.decoratedAvatarViewModel?.avatar?.avatar?.image?.thumbnails
    ];

    for (const thumbnails of possibleAvatarPaths) {
      if (thumbnails && thumbnails.length > 0) {
        // Get the highest resolution (usually the last one)
        avatarUrl = thumbnails[thumbnails.length - 1].url;
        break;
      }
    }

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
    } else {
      // Fallback: check all metadata rows for "subscribers"
      const rows = header.metadata?.contentMetadataViewModel?.metadataRows || [];
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
