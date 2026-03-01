"use client";

import { useState } from "react";
import type { Song } from "@/lib/songData";

type Props = {
  song: Song;
  onSelect: (song: Song) => void;
  isNew?: boolean;
};

export default function SongCardPublic({ song, onSelect, isNew }: Props) {
  const [showToast, setShowToast] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  // Public に出すのは ◎ / ○ / △ のみ
  if (!["◎", "○", "△"].includes(song.skillLevel)) return null;

  // コピー処理
  const copyInfo = () => {
    const text = `${song.id}. ${song.title} / ${song.artist}`;
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // PC：Ctrl+Click → コピー
  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      copyInfo();
      return;
    }
    onSelect(song);
  };

  // iPhone：ダブルタップでコピー
  const handleDoubleTap = () => {
    const now = Date.now();

    if (now - lastTap < 300) {
      // ダブルタップ判定
      copyInfo();
    }

    setLastTap(now);
  };

  return (
    <div className="relative">
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

      {/* カード本体 */}
      <button
        onClick={handleClick}
        onTouchStart={handleDoubleTap}  // ← ダブルタップ判定
        className="
          w-full text-left rounded-xl p-4
          bg-gradient-to-r from-white/30 to-white/10
          backdrop-blur-xl
          border border-white/50
          shadow-xl shadow-black/40
          hover:from-white/40 hover:to-white/20
          active:scale-[0.98]
          transition
        "
      >
        <div className="flex flex-col gap-1 text-white">
          {/* タイトル / アーティスト */}
          <div className="text-sm font-bold">
            {song.title}
            <span className="font-normal text-white/100"> / {song.artist}</span>
          </div>

          {/* ジャンル ＋ スキルレベルバッジ */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/80">🎵 {song.genre}</span>

            {song.skillLevel === "◎" && (
              <SkillBadge color="bg-green-400/40" icon="◎" text="気持ちよく歌っちゃう曲" />
            )}
            {song.skillLevel === "○" && (
              <SkillBadge color="bg-blue-400/40" icon="○" text="それなりに歌える曲" />
            )}
            {song.skillLevel === "△" && (
              <SkillBadge color="bg-yellow-400/40" icon="△" text="特訓させたいならこの曲" />
            )}
          </div>
        </div>
      </button>

      {/* トースト */}
      {showToast && (
        <div
          className="
            fixed bottom-8 right-6
            px-4 py-2 rounded-full text-xs text-white
            bg-white/20 backdrop-blur-md shadow-lg
            animate-toast
	    z-[9999]
          "
        >
          コピーしたよ！そのままお便りBOXに貼ってね！
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
          animation: toast 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

/* スキルレベルバッジ */
function SkillBadge({ color, icon, text }: { color: string; icon: string; text: string }) {
  return (
    <div
      className={`
        inline-flex items-center gap-1
        px-2 py-1 rounded-full
        ${color}
        border border-white/40
        shadow-md shadow-black/20
        text-[11px] text-white
      `}
    >
      <span className="text-white">{icon}</span>
      <span className="tracking-wide text-white">{text}</span>
    </div>
  );
}