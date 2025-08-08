import { NextResponse } from "next/server";
import { getPlayerBattlelog } from "@/lib/cr";

export async function GET(_: Request, { params }: { params: { tag: string } }) {
  try {
    const tag = decodeURIComponent(params.tag);
    const log = await getPlayerBattlelog(tag);
    return NextResponse.json(log);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to fetch battlelog" }, { status: 500 });
  }
} 