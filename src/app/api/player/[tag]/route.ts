import { NextResponse } from "next/server";
import { getPlayer } from "@/lib/cr";

export async function GET(_: Request, { params }: { params: { tag: string } }) {
  try {
    const tag = decodeURIComponent(params.tag);
    const player = await getPlayer(tag);
    return NextResponse.json(player);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to fetch player" }, { status: 500 });
  }
} 