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

  // diff 保存
  const loadDiffs = () => {
    const raw = localStorage.getItem("song_edits_v1");
    return raw ? JSON.parse(raw) : {};
  };

  const saveDiffs = (obj: any) => {
    localStorage.setItem("song_edits_v1", JSON.stringify(obj));
  };

  // 新規 ID（最大 ID + 1）
  const getNextId = () => {
    const raw = localStorage.getItem("songData_max_id");
    const max = raw ? Number(raw) : 0;
    const next = max + 1;
    localStorage.setItem("songData_max_id", String(next));
    return next;
  };

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
    <main className="mx-auto max-w-xl px-4 py-6 text-white">
      <h1 className="text-lg font-bold mb-4">新規曲追加</h1>

      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={titleKana}
          onChange={(e) => setTitleKana(e.target.value)}
          placeholder="タイトル（読み仮名）"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="アーティスト"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={artistKana}
          onChange={(e) => setArtistKana(e.target.value)}
          placeholder="アーティスト（読み仮名）"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={scale}
          onChange={(e) => setScale(e.target.value)}
          placeholder="スケール（例：A#m）"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="ジャンル"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={instUrl}
          onChange={(e) => setInstUrl(e.target.value)}
          placeholder="inst URL（任意）"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        {/* skillLevel → セレクトに変更 */}
        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value as any)}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white"
        >
          <option value="">skillLevel を選択</option>
          <option value="◎">◎（得意）</option>
          <option value="○">○（普通）</option>
          <option value="△">△（苦手）</option>
          <option value="×">×（不可）</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          公開する
        </label>

        <button
          disabled={disabled}
          onClick={handleSave}
          className={`w-full py-2 rounded-lg transition ${
            disabled
              ? "bg-white/20 text-white/40"
              : "bg-white/30 hover:bg-white/40 text-white"
          }`}
        >
          保存する
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full shadow-lg animate-fade">
          保存したよ！
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
    </main>
  );
}