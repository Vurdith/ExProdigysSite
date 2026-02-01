export interface RobloxGameData {
  title: string;
  description: string;
  currentPlayers: number | null;
  imageUrl: string;
}

export function extractPlaceId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const match = url.pathname.match(/\/games\/(\d+)/);
    if (match?.[1]) return match[1];
  } catch {
    // Fall through to regex match
  }

  const match = trimmed.match(/\/games\/(\d+)/);
  return match?.[1] || null;
}

export async function getRobloxGameData(urlOrId: string): Promise<RobloxGameData> {
  const placeId = extractPlaceId(urlOrId);
  if (!placeId) {
    throw new Error("Invalid Roblox game URL or place id.");
  }

  const universeId = await getUniverseId(placeId);
  if (!universeId) {
    throw new Error("Unable to resolve universe id.");
  }

  const gameDetails = await getGameDetails(universeId);
  if (!gameDetails) {
    throw new Error("Unable to fetch game details.");
  }

  const imageUrl = await getGameThumbnail(universeId, placeId);

  return {
    title: gameDetails.name || "",
    description: gameDetails.description || "",
    currentPlayers: typeof gameDetails.playing === "number" ? gameDetails.playing : null,
    imageUrl: imageUrl || "",
  };
}

export function formatPlayerCount(count: number | null): string {
  if (!count || Number.isNaN(count)) return "Current: N/A";

  const format = (value: number, suffix: string) => {
    const fixed = value.toFixed(1);
    const trimmed = fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
    return `${trimmed}${suffix}+`;
  };

  if (count >= 1_000_000_000) return `Current: ${format(count / 1_000_000_000, "B")}`;
  if (count >= 1_000_000) return `Current: ${format(count / 1_000_000, "M")}`;
  if (count >= 1_000) return `Current: ${format(count / 1_000, "K")}`;

  return `Current: ${count}+`;
}

async function getUniverseId(placeId: string): Promise<number | null> {
  const response = await fetch(
    `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { universeId?: number };
  return typeof data.universeId === "number" ? data.universeId : null;
}

async function getGameDetails(universeId: number): Promise<{
  name?: string;
  description?: string;
  playing?: number;
} | null> {
  const response = await fetch(
    `https://games.roblox.com/v1/games?universeIds=${universeId}`
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { data?: Array<any> };
  return data.data?.[0] || null;
}

async function getGameThumbnail(universeId: number, placeId: string): Promise<string | null> {
  // 1) Prefer game icons endpoint (most reliable)
  const iconResponse = await fetch(
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`
  );
  if (iconResponse.ok) {
    const iconData = (await iconResponse.json()) as { data?: Array<{ imageUrl?: string }> };
    const iconUrl = iconData.data?.[0]?.imageUrl;
    if (iconUrl) return iconUrl;
  }

  // 2) Fallback to legacy multiget (wide)
  const multiResponse = await fetch(
    `https://thumbnails.roblox.com/v1/games/multiget?universeIds=${universeId}&size=768x432&format=Png&isCircular=false`
  );
  if (multiResponse.ok) {
    const multiData = (await multiResponse.json()) as { data?: Array<{ imageUrl?: string }> };
    const multiUrl = multiData.data?.[0]?.imageUrl;
    if (multiUrl) return multiUrl;
  }

  // 3) Final fallback to place thumbnail
  const placeResponse = await fetch(
    `https://thumbnails.roblox.com/v1/places?placeIds=${placeId}&size=768x432&format=Png&isCircular=false`
  );
  if (!placeResponse.ok) return null;
  const placeData = (await placeResponse.json()) as { data?: Array<{ imageUrl?: string }> };
  return placeData.data?.[0]?.imageUrl || null;
}
