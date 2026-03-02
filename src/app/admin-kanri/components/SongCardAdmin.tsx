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
      {/* タイトル */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold">{song.title}</h2>

        {/* NEW バッジ */}
        {song.isNew && (
          <span className="px-2 py-0.5 text-xs rounded bg-pink-500 text-white">
            NEW
          </span>
        )}

        {/* diff バッジ */}
        {song.hasDiff && (
          <span className="px-2 py-0.5 text-xs rounded bg-yellow-500 text-black">
            未反映あり
          </span>
        )}
      </div>

      {/* アーティスト */}
      <p className="text-white/70">{song.artist}</p>

      {/* Kana */}
      <p className="text-white/50 text-sm">
        {song.titleKana} / {song.artistKana}
      </p>

      {/* 下部情報 */}
      <div className="mt-2 flex justify-between text-sm text-white/70">
        <span>ジャンル: {song.genre}</span>
        <span>再生: {song.playCount}</span>
      </div>
    </div>
  );
}