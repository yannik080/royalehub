import Image from "next/image";

export default function CardIcon({ name, iconUrl, size = 56 }: { name: string; iconUrl?: string; size?: number }) {
  return (
    <div className="flex items-center gap-2">
      {iconUrl ? (
        <Image src={iconUrl} alt={name} width={size} height={size} className="rounded" />
      ) : (
        <div style={{ width: size, height: size }} className="rounded bg-zinc-800" />
      )}
      <span className="text-sm text-zinc-200">{name}</span>
    </div>
  );
} 