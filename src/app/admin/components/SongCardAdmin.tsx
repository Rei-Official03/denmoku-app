"use client";

import { useRouter } from "next/navigation";
import type { Song } from "@/lib/songData";

type Props = {
  song: Song;
};

export default function SongCardAdmin({ song }: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/admin/song/${song.id}`)}
      className="
        p-4 rounded-xl bg-white/10 backdrop-blur-md
        border border-white/10 shadow-md text-white
        cursor-pointer transition
        hover:bg-white/20 hover:shadow-lg active:scale-[0.98]
      "
    >
      <div className="text-sm font-bold drop-shadow-sm">{song.title}</div>
      <div className="text-xs text-white/70 mt-0.5">{song.artist}</div>
    </div>
  );
}