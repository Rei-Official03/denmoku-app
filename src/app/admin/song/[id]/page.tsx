"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { songs } from "@/lib/songData";

export default function SongDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const song = songs.find((s) => s.id === id);

  const [isEditing, setIsEditing] = useState(false);

  // -----------------------------------
  // 再生回数
  // -----------------------------------
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(`play_count_${id}`);
    setPlayCount(raw ? Number(raw) : 0);
  }, [id]);

  const handlePlay = () => {
    const newCount = playCount + 1;
    setPlayCount(newCount);

    if (typeof window !== "undefined") {
      localStorage.setItem(`play_count_${id}`, String(newCount));
    }
  };

  // -----------------------------------
  // 編集用 state
  // -----------------------------------
  const [title, setTitle] = useState(song?.title ?? "");
  const [titleKana, setTitleKana] = useState(song?.titleKana ?? "");
  const [artist, setArtist] = useState(song?.artist ?? "");
  const [artistKana, setArtistKana] = useState(song?.artistKana ?? "");
  const [scale, setScale] = useState(song?.scale ?? "");
  const [genre, setGenre] = useState(song?.genre ?? "");
  const [skillLevel, setSkillLevel] = useState<"◎" | "○" | "△" | "×" | "">(
    (song?.skillLevel as any) ?? ""
  );
  const [isPublic, setIsPublic] = useState(song?.isPublic ?? false);

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
    } catch {}
  };

  const handleSave = () => {
    const diffs = loadDiffs();
    diffs[id] = {
      title,
      titleKana,
      artist,
      artistKana,
      scale,
      genre,
      skillLevel,
      isPublic,
    };
    saveDiffs(diffs);
    setIsEditing(false);
  };

  if (!song) {
    return (
      <main
        className="
          mx-auto max-w-xl px-4 py-6 text-white
          bg-white/5 backdrop-blur-md rounded-xl
          border border-white/10 shadow-lg
        "
      >
        <div className="text-white/70">曲が見つかりませんでした（ID: {id}）</div>
      </main>
    );
  }

  return (
    <main
      className="
        mx-auto max-w-xl px-4 py-6 text-white
        bg-white/5 backdrop-blur-md rounded-xl
        border border-white/10 shadow-lg space-y-6
      "
    >
      <h1 className="text-xl font-bold drop-shadow">{song.title}</h1>
      <p className="text-white/70">{song.artist}</p>

      {/* 再生回数 */}
      <div className="text-sm text-white/60">再生回数：{playCount} 回</div>

      {/* 閲覧モード */}
      {!isEditing && (
        <>
          <div className="text-sm text-white/60 space-y-1">
            <div>ID: {song.id}</div>
            <div>読み：{song.titleKana}</div>
            <div>アーティスト読み：{song.artistKana}</div>
            <div>キー：{song.scale}</div>
            <div>ジャンル：{song.genre}</div>
            <div>難易度：{song.skillLevel}</div>
            <div>公開：{song.isPublic ? "はい" : "いいえ"}</div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => router.back()}
              className="
                px-4 py-2 rounded-lg
                bg-white/20 hover:bg-white/30
                backdrop-blur-sm transition
              "
            >
              ← 戻る
            </button>

            {song.instUrl && (
              <a
                href={song.instUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseDown={handlePlay}
                className="
                  px-4 py-2 rounded-lg
                  bg-orange-400/20 hover:bg-orange-400/30
                  backdrop-blur-sm text-orange-200 transition
                "
              >
                歌う
              </a>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="
                px-4 py-2 rounded-lg
                bg-green-400/20 hover:bg-green-400/30
                backdrop-blur-sm text-green-200 transition
              "
            >
              編集
            </button>
          </div>
        </>
      )}

      {/* 編集モード */}
      {isEditing && (
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg bg-white/20 text-white
              placeholder-white/50 focus:outline-none
              focus:ring-2 focus:ring-sky-300/40 transition
            "
          />

          <input
            value={titleKana}
            onChange={(e) => setTitleKana(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg bg-white/20 text-white
              placeholder-white/50 focus:outline-none
              focus:ring-2 focus:ring-sky-300/40 transition
            "
          />

          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg bg-white/20 text-white
              placeholder-white/50 focus:outline-none
              focus:ring-2 focus:ring-sky-300/40 transition
            "
          />

          <input
            value={artistKana}
            onChange={(e) => setArtistKana(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg bg-white/20 text-white
              placeholder-white/50 focus:outline-none
              focus:ring-2 focus:ring-sky-300/40 transition
            "
          />

          <input
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg bg-white/20 text-white
              placeholder-white/50 focus:outline-none
              focus:ring-2 focus:ring-sky-300/40 transition
            "
          />

          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg bg-white/20 text-white
              placeholder-white/50 focus:outline-none
              focus:ring-2 focus:ring-sky-300/40 transition
            "
          />

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

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="accent-sky-300"
            />
            公開する
          </label>

          <button
            onClick={handleSave}
            className="
              px-4 py-2 rounded-lg
              bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200
              hover:from-sky-500 hover:via-sky-400 hover:to-sky-300
              text-white font-bold shadow-sm hover:shadow transition
            "
          >
            保存
          </button>
        </div>
      )}
    </main>
  );
}