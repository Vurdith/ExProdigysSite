export interface YouTubeChannelData {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
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
    const dataMatch = html.match(/var ytInitialData = ({[\s\S]*?});<\/script>/);
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

    const candidateTexts: string[] = [];
    const headerSubText = header.subscriberCountText?.simpleText;
    if (headerSubText) candidateTexts.push(headerSubText);
    const headerSubRuns = header.subscriberCountText?.runs?.map((r: any) => r.text).join("");
    if (headerSubRuns) candidateTexts.push(headerSubRuns);
    const headerSubLabel = header.subscriberCountText?.accessibility?.accessibilityData?.label;
    if (headerSubLabel) candidateTexts.push(headerSubLabel);

    const headerRows = header.metadata?.contentMetadataViewModel?.metadataRows || [];
    for (const row of headerRows) {
      const parts = row.metadataParts || [];
      for (const part of parts) {
        const text = part.text?.content;
        if (text && text.toLowerCase().includes("subscriber")) {
          candidateTexts.push(text);
        }
      }
    }

    const pageRows = pageHeader?.metadata?.contentMetadataViewModel?.metadataRows || [];
    for (const row of pageRows) {
      const parts = row.metadataParts || [];
      for (const part of parts) {
        const text = part.text?.content;
        if (text && text.toLowerCase().includes("subscriber")) {
          candidateTexts.push(text);
        }
      }
    }

    const bestSubscriber = pickLargestCount(candidateTexts, normalizeSubscriberText);
    if (bestSubscriber) subscriberCount = bestSubscriber;

    // View Count
    let viewCount = "N/A";
    const viewCandidateTexts: string[] = [];

    const viewText = header.viewCountText?.simpleText;
    if (viewText) viewCandidateTexts.push(viewText);
    const viewRuns = header.viewCountText?.runs?.map((r: any) => r.text).join("");
    if (viewRuns) viewCandidateTexts.push(viewRuns);
    const viewLabel = header.viewCountText?.accessibility?.accessibilityData?.label;
    if (viewLabel) viewCandidateTexts.push(viewLabel);

    for (const row of headerRows) {
      const parts = row.metadataParts || [];
      for (const part of parts) {
        const text = part.text?.content;
        if (text && text.toLowerCase().includes("views")) {
          viewCandidateTexts.push(text);
        }
      }
    }

    for (const row of pageRows) {
      const parts = row.metadataParts || [];
      for (const part of parts) {
        const text = part.text?.content;
        if (text && text.toLowerCase().includes("views")) {
          viewCandidateTexts.push(text);
        }
      }
    }

    // Fallback to microformat / channel metadata if present
    const micro = json.microformat?.microformatDataRenderer;
    const microView = micro?.viewCount;
    if (microView) viewCandidateTexts.push(`${microView} views`);

    const channelMeta = json.metadata?.channelMetadataRenderer;
    const metaView = channelMeta?.viewCount;
    if (metaView) viewCandidateTexts.push(`${metaView} views`);

    // About tab metadata (newer layouts)
    const aboutViewText = findFirstTextContaining(
      json,
      (value) => value.includes("views") && /\d/.test(value),
      6
    );
    if (aboutViewText) viewCandidateTexts.push(aboutViewText);

    for (const text of viewCandidateTexts) {
      const normalized = normalizeViewCountText(text);
      if (normalized) {
        viewCount = normalized;
        break;
      }
    }

    // Video Count
    let videoCount = "N/A";
    const videoCandidateTexts: string[] = [];

    const videoText = header.videosCountText?.simpleText;
    if (videoText) videoCandidateTexts.push(videoText);
    const videoRuns = header.videosCountText?.runs?.map((r: any) => r.text).join("");
    if (videoRuns) videoCandidateTexts.push(videoRuns);

    for (const row of headerRows) {
      const parts = row.metadataParts || [];
      for (const part of parts) {
        const text = part.text?.content;
        if (text && text.toLowerCase().includes("videos")) {
          videoCandidateTexts.push(text);
        }
      }
    }

    for (const row of pageRows) {
      const parts = row.metadataParts || [];
      for (const part of parts) {
        const text = part.text?.content;
        if (text && text.toLowerCase().includes("videos")) {
          videoCandidateTexts.push(text);
        }
      }
    }

    const aboutVideoText = findFirstTextContaining(
      json,
      (value) => value.includes("videos") && /\d/.test(value),
      6
    );
    if (aboutVideoText) videoCandidateTexts.push(aboutVideoText);

    for (const text of videoCandidateTexts) {
      const normalized = normalizeViewCountText(text);
      if (normalized) {
        videoCount = normalized;
        break;
      }
    }

    return {
      id: metadata.externalId || "",
      title,
      description,
      customUrl: metadata.ownerUrls?.[0] || fullUrl,
      subscriberCount,
      viewCount,
      videoCount,
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

function normalizeSubscriberText(text: string): string | null {
  const cleaned = text.trim();
  if (!cleaned) return null;

  const lower = cleaned.toLowerCase();
  if (lower.includes("hidden")) return "Hidden";

  // Prefer the first numeric token and optional suffix (K/M/B/T)
  const match = cleaned.match(/([\d.,]+)\s*([KMBT])?/i);
  if (match) {
    const number = match[1];
    const suffix = match[2] || "";
    return `${number}${suffix}+`.trim();
  }

  return null;
}

function normalizeViewCountText(text: string): string | null {
  const cleaned = text.trim();
  if (!cleaned) return null;

  const match = cleaned.match(/([\d.,]+)\s*([KMBT])?/i);
  if (match) {
    const number = match[1];
    const suffix = match[2] || "";
    return `${number}${suffix}+`.trim();
  }

  return null;
}

function pickLargestCount(
  texts: string[],
  normalizer: (text: string) => string | null
): string | null {
  let bestValue = 0;
  let bestText: string | null = null;

  for (const text of texts) {
    const normalized = normalizer(text);
    if (!normalized) continue;
    const numeric = countToNumber(normalized);
    if (numeric > bestValue) {
      bestValue = numeric;
      bestText = normalized;
    }
  }

  return bestText;
}

function countToNumber(text: string): number {
  const match = text.match(/([\d.,]+)\s*([KMBT])?/i);
  if (!match) return 0;
  const raw = match[1].replace(/,/g, "");
  const suffix = (match[2] || "").toUpperCase();
  const base = parseFloat(raw);
  if (Number.isNaN(base)) return 0;
  switch (suffix) {
    case "K":
      return base * 1_000;
    case "M":
      return base * 1_000_000;
    case "B":
      return base * 1_000_000_000;
    case "T":
      return base * 1_000_000_000_000;
    default:
      return base;
  }
}

function findFirstTextContaining(
  input: any,
  predicate: (value: string) => boolean,
  maxDepth = 6
): string | null {
  const seen = new Set<any>();
  const stack: Array<{ value: any; depth: number }> = [{ value: input, depth: 0 }];

  while (stack.length) {
    const { value, depth } = stack.pop()!;
    if (value && typeof value === "object") {
      if (seen.has(value) || depth > maxDepth) continue;
      seen.add(value);

      if (Array.isArray(value)) {
        for (const item of value) {
          stack.push({ value: item, depth: depth + 1 });
        }
      } else {
        for (const key of Object.keys(value)) {
          stack.push({ value: value[key], depth: depth + 1 });
        }
      }
    } else if (typeof value === "string") {
      const normalized = value.toLowerCase();
      if (predicate(normalized)) {
        return value;
      }
    }
  }

  return null;
}
