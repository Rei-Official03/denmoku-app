"use client";

import { useRouter } from "next/navigation";
import type { SongWithMeta } from "@/lib/types";

export default function SongCardAdmin({ song }: { song: SongWithMeta }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin-kanri/song/${song.id}`);
  };

  const isNew = song.hasDiff && song.isNew;
  const hasDiff = song.hasDiff && !song.isNew;

  return (
    <div
      onClick={handleClick}
      className="
        relative
        p-4 rounded-lg bg-white/10 border border-white/20
        shadow-md cursor-pointer active:scale-95 transition
      "
    >
      {/* NEW バッジ */}
      {isNew && (
        <span
          className="
            absolute -top-2 -left-2 z-20
            px-2 py-0.5 rounded-full text-[10px] font-bold
            bg-orange-400/30 text-orange-100
            backdrop-blur-md border border-white/20 shadow-sm
          "
        >
          ★NEW
        </span>
      )}

      {/* diff バッジ */}
      {hasDiff && (
        <span
          className="
            absolute -top-2 -right-2 z-20
            px-2 py-0.5 rounded-full text-[10px] font-bold
            bg-yellow-400/30 text-yellow-100
            backdrop-blur-md border border-white/20 shadow-sm
          "
        >
          未反映あり
        </span>
      )}

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