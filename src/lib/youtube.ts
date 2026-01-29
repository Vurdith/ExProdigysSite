export interface YouTubeChannelData {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  subscriberCount: string;
  avatarUrl: string;
}

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function getChannelData(urlOrHandle: string): Promise<YouTubeChannelData | null> {
  if (!API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not defined in environment variables");
  }

  const identifier = parseYouTubeIdentifier(urlOrHandle);
  if (!identifier) return null;

  let queryParam = "";
  if (identifier.type === "handle") {
    // YouTube handles include the @ in the API parameter
    queryParam = `forHandle=${encodeURIComponent(identifier.value)}`;
  } else if (identifier.type === "id") {
    queryParam = `id=${identifier.value}`;
  } else if (identifier.type === "username") {
    queryParam = `forUsername=${identifier.value}`;
  }

  const response = await fetch(
    `${BASE_URL}/channels?part=snippet,statistics&${queryParam}&key=${API_KEY}`
  );

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  const channel = data.items[0];
  const { snippet, statistics } = channel;

  return {
    id: channel.id,
    title: snippet.title,
    description: snippet.description,
    customUrl: snippet.customUrl,
    subscriberCount: formatSubscriberCount(statistics.subscriberCount),
    avatarUrl: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
  };
}

function parseYouTubeIdentifier(input: string): { type: "handle" | "id" | "username"; value: string } | null {
  // Clean input
  const cleanInput = input.trim().replace(/\/$/, "");

  // 1. Handle (e.g., @KreekCraft or youtube.com/@KreekCraft)
  const handleMatch = cleanInput.match(/(?:youtube\.com\/)?(@[\w.-]+)/);
  if (handleMatch) {
    return { type: "handle", value: handleMatch[1] };
  }

  // 2. Channel ID (e.g., UC... or youtube.com/channel/UC...)
  const idMatch = cleanInput.match(/(?:youtube\.com\/channel\/)?(UC[\w-]{22})/);
  if (idMatch) {
    return { type: "id", value: idMatch[1] };
  }

  // 3. Custom URL (legacy /c/ or /user/)
  const customMatch = cleanInput.match(/youtube\.com\/(?:c\/|user\/)?([\w.-]+)/);
  if (customMatch) {
    // Try as handle first if it's not a known path
    const value = customMatch[1];
    if (cleanInput.includes("/user/")) {
        return { type: "username", value };
    }
    // Most modern custom URLs are handles, but without the @
    return { type: "handle", value: `@${value}` };
  }

  // 4. Just the handle/name provided
  if (cleanInput.startsWith("@")) {
    return { type: "handle", value: cleanInput };
  }

  return null;
}

function formatSubscriberCount(countStr: string): string {
  const count = parseInt(countStr, 10);
  if (isNaN(count)) return countStr;

  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M+";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
  }
  return count.toString();
}
