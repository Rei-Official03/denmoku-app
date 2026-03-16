"use client";

import { useRouter } from "next/navigation";
import type { Song } from "@/lib/songData";

export default function SongCardAdmin({ song }: { song: Song }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin-kanri/song/${song.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        p-4 rounded-lg bg-white/10 border border-white/20
        shadow-md cursor-pointer active:scale-95 transition
      "
    >
      {/* 上段：タイトル / アーティスト名 + スケール */}
      <div className="flex justify-between items-center">
        <div className="font-bold">
          {song.title} / {song.artist}
        </div>
        <div className="text-white/70 text-sm">{song.scale}</div>
      </div>

      {/* 下段：ジャンル + 再生回数 */}
      <div className="mt-2 flex justify-between text-sm text-white/70">
        <span>ジャンル: {song.genre}</span>
        <span>再生: {song.playCount}</span>
      </div>
    </div>
  );
}