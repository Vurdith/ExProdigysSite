import { NextRequest, NextResponse } from "next/server";
import { getChannelData } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "YouTube URL or handle is required" }, { status: 400 });
  }

  try {
    const data = await getChannelData(url);
    if (!data) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch YouTube data" }, { status: 500 });
  }
}
