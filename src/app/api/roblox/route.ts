import { NextRequest, NextResponse } from "next/server";
import { getRobloxGameData } from "@/lib/roblox";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body || {};

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid Roblox game URL." },
        { status: 400 }
      );
    }

    const data = await getRobloxGameData(url);

    return NextResponse.json({
      title: data.title,
      description: data.description,
      currentPlayers: data.currentPlayers,
      imageUrl: data.imageUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch Roblox game data." },
      { status: 500 }
    );
  }
}
