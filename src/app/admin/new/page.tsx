"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function NewSongPage() {
  const params = useSearchParams();
  const router = useRouter();

  // URL から自動入力
  const initialTitle = params.get("title") || "";
  const initialArtist = params.get("artist") || "";

  // 入力項目
  const [title, setTitle] = useState(initialTitle);
  const [titleKana, setTitleKana] = useState("");
  const [artist, setArtist] = useState(initialArtist);
  const [artistKana, setArtistKana] = useState("");
  const [scale, setScale] = useState("");
  const [genre, setGenre] = useState("");
  const [instUrl, setInstUrl] = useState("");
  const [skillLevel, setSkillLevel] = useState<"◎" | "○" | "△" | "×" | "">("");
  const [isPublic, setIsPublic] = useState(false);

  const [toast, setToast] = useState(false);

  // -----------------------------------
  // diff 保存
  // -----------------------------------
  const loadDiffs = () => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("song_edits_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveDiffs = (obj: any) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("song_edits_v1", JSON.stringify(obj));
    } catch {
      // localStorage full などは握りつぶす
    }
  };

  // -----------------------------------
  // 新規 ID（最大 ID + 1）
  // -----------------------------------
  const getNextId = () => {
    if (typeof window === "undefined") return 1;

    try {
      const raw = localStorage.getItem("songData_max_id");
      const max = raw ? Number(raw) : 0;
      const next = max + 1;
      localStorage.setItem("songData_max_id", String(next));
      return next;
    } catch {
      return Date.now(); // fallback
    }
  };

  // -----------------------------------
  // 保存処理
  // -----------------------------------
  const handleSave = () => {
    const id = getNextId();

    const diff = {
      title,
      titleKana,
      artist,
      artistKana,
      scale,
      genre,
      instUrl,
      skillLevel,
      isPublic,
    };

    const diffs = loadDiffs();
    diffs[id] = diff;
    saveDiffs(diffs);

    setToast(true);
    setTimeout(() => setToast(false), 1500);

    router.push("/admin");
  };

  const disabled =
    !title.trim() ||
    !artist.trim() ||
    !titleKana.trim() ||
    !artistKana.trim() ||
    !scale.trim() ||
    !genre.trim() ||
    !skillLevel;

  return (
    <main
      className="
        mx-auto max-w-xl px-4 py-6 text-white
        bg-white/5 backdrop-blur-md rounded-xl
        border border-white/10 shadow-lg
      "
    >
      <h1 className="text-lg font-bold mb-6 tracking-wide drop-shadow">
        新規曲追加
      </h1>

      <div className="space-y-4">
        {/* 入力欄 */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition
          "
        />

        <input
          value={titleKana}
          onChange={(e) => setTitleKana(e.target.value)}
          placeholder="タイトル（読み仮名）"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition
          "
        />

        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="アーティスト"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition
          "
        />

        <input
          value={artistKana}
          onChange={(e) => setArtistKana(e.target.value)}
          placeholder="アーティスト（読み仮名）"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition
          "
        />

        <input
          value={scale}
          onChange={(e) => setScale(e.target.value)}
          placeholder="スケール（例：A#m）"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition
          "
        />

        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="ジャンル"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition
          "
        />

        <input
          value={instUrl}
          onChange={(e) => setInstUrl(e.target.value)}
          placeholder="inst URL（任意）"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition
          "
        />

        {/* skillLevel */}
        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value as any)}
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 text-white
            focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition
          "
        >
          <option value="">skillLevel を選択</option>
          <option value="◎">◎（得意）</option>
          <option value="○">○（普通）</option>
          <option value="△">△（苦手）</option>
          <option value="×">×（不可）</option>
        </select>

        {/* 公開フラグ */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="accent-sky-300"
          />
          公開する
        </label>

        {/* 保存ボタン */}
        <button
          disabled={disabled}
          onClick={handleSave}
          className={`
            w-full py-2 rounded-lg font-bold transition
            ${
              disabled
                ? "bg-sky-400/20 text-white/40 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200 hover:from-sky-500 hover:via-sky-400 hover:to-sky-300 text-white shadow-sm hover:shadow"
            }
          `}
        >
          保存する
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="
            fixed bottom-8 right-6 bg-white/20 backdrop-blur-md
            text-white text-xs px-4 py-2 rounded-full shadow-lg
            animate-toast
          "
        >
          保存したよ！
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
    </main>
  );
}