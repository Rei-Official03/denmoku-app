"use client";

import { useState } from "react";
import type { Song } from "@/lib/songData";

export default function SongCardPublic({
  song,
  onSelect,
}: {
  song: Song;
  onSelect: (song: Song) => void;
}) {
  const [pressTimer, setPressTimer] =
    useState<ReturnType<typeof setTimeout> | null>(null);
  const [showToast, setShowToast] = useState(false);

  // コピー処理
  const copyInfo = () => {
    const text = `${song.id}. ${song.title} / ${song.artist}`;
    navigator.clipboard.writeText(text);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 1200);
  };

  // PC：Ctrl + クリックでコピー
  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      copyInfo();
      return;
    }
    onSelect(song);
  };

  // スマホ：長押しでコピー
  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      copyInfo();
    }, 500);
    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  // スキルレベルの色
  const levelColor =
    {
      "◎": "text-green-400",
      "○": "text-blue-400",
      "△": "text-yellow-400",
      "×": "text-red-400",
    }[song.skillLevel] ?? "text-white/60";

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full text-left rounded-xl bg-white/10 backdrop-blur-md p-4 shadow-md hover:bg-white/15 active:scale-[0.98] transition"
      >
        {/* タイトル + スキルレベル */}
        <div className="flex items-center justify-between">
          <div className="text-base font-bold text-white">{song.title}</div>
          <span className={`text-sm font-bold ${levelColor}`}>
            {song.skillLevel}
          </span>
        </div>

        {/* アーティスト */}
        <div className="text-sm text-white/70">{song.artist}</div>
      </button>

      {/* トースト */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full shadow-lg animate-fade">
          コピーしたよ！
        </div>
      )}

      <style>{`
        @keyframes fade {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade {
          animation: fade 1.2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}