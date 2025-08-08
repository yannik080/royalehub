"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlayerSearch() {
  const [tag, setTag] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = tag.trim();
    if (!cleaned) return;
    const normalized = cleaned.toUpperCase().replace(/^#/, "");
    router.push(`/player/%23${normalized}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex gap-2">
      <input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        name="tag"
        placeholder="Enter player tag, e.g. #P0LYJ8"
        className="flex-1 rounded bg-black/40 border border-zinc-800 px-3 py-2 outline-none"
      />
      <button className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white" type="submit">Search</button>
    </form>
  );
} 