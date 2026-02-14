"use client";

import { useState } from "react";
import type { Song } from "@/lib/songData";

type Props = {
  song: Song;
  onSelect: (song: Song) => void;
  isNew?: boolean;
};

export default function SongCardPublic({ song, onSelect, isNew }: Props) {
  const [pressTimer, setPressTimer] =
    useState<ReturnType<typeof setTimeout> | null>(null);
  const [showToast, setShowToast] = useState(false);

  const copyInfo = () => {
    const text = `${song.id}. ${song.title} / ${song.artist}`;
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1200);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      copyInfo();
      return;
    }
    onSelect(song);
  };

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      copyInfo();
    }, 500);
    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  const levelColor =
    {
      "◎": "text-green-400",
      "○": "text-blue-300",
      "△": "text-yellow-300",
      "×": "text-red-400",
    }[song.skillLevel] ?? "text-white/60";

  return (
    <div className="relative">
      {/* ★ NEW バッジ（カードの前面・左上外側） */}
      {isNew && (
        <span
          className="
            absolute -top-2 -left-2
            z-20
            text-[10px] font-bold
            px-2 py-0.5 rounded-full
            bg-orange-400/30 text-orange-100
            backdrop-blur-md border border-white/20
            shadow-sm
          "
        >
          ★NEW
        </span>
      )}

      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="
          w-full text-left rounded-xl bg-white/10 backdrop-blur-md p-4
          shadow-md hover:bg-white/15 active:scale-[0.98]
          transition border border-white/10
        "
      >
        <div className="flex items-center justify-between">
          <div className="text-base font-bold text-white drop-shadow-sm">
            {song.title}
          </div>
          <span className={`text-sm font-bold ${levelColor}`}>
            {song.skillLevel}
          </span>
        </div>

        <div className="text-sm text-white/70 mt-1">{song.artist}</div>
      </button>

      {showToast && (
        <div
          className="
            fixed bottom-8 right-6 bg-white/20 backdrop-blur-md
            text-white text-xs px-4 py-2 rounded-full shadow-lg
            animate-toast
          "
        >
          コピーしたよ！
        </div>
      )}

      <style>{`
        @keyframes toast {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-toast {
          animation: toast 1.2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}