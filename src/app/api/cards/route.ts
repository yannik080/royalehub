import { NextResponse } from "next/server";
import { getCards } from "@/lib/cr";

export const revalidate = 60 * 60; // 1 hour

export async function GET() {
  try {
    const items = await getCards();
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to fetch cards" }, { status: 500 });
  }
} 