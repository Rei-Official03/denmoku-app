"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { mergeSongs } from "@/lib/mergeSongs";
import type { Song } from "@/lib/songData";

export default function SongDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [song, setSong] = useState<Song | null>(null);
  const [diffs, setDiffs] = useState<Record<string, any>>({});

  // diff 読み込み
  const loadDiffs = () => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("song_edits_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  // データ読み込み
  useEffect(() => {
    const d = loadDiffs();
    setDiffs(d);

    const merged = mergeSongs(d);
    const s = merged.find((s) => s.id === id) || null;
    setSong(s);
  }, [id]);

  if (!song) {
    return (
      <main className="mx-auto max-w-xl px-4 py-6 text-white">
        曲が見つかりませんでした（ID: {id}）
      </main>
    );
  }

  // ⭐ playCount を diff に入れず、専用ストレージで管理
  const handleSing = () => {
    const raw = localStorage.getItem("song_playcount_v1");
    const playCounts = raw ? JSON.parse(raw) : {};

    playCounts[id] = (playCounts[id] || song.playCount || 0) + 1;

    localStorage.setItem("song_playcount_v1", JSON.stringify(playCounts));

    // instUrl があれば開く
    const hasUrl =
      typeof song.instUrl === "string" && song.instUrl.trim() !== "";

    if (hasUrl) {
      window.open(song.instUrl, "_blank");
      return;
    }

    // instUrl がなければ YouTube + コピー
    window.open("https://www.youtube.com/", "_blank");
    navigator.clipboard.writeText(`${song.title} カラオケ`);
  };

  // ⭐ diff 表示から playCount を除外
  const diff = diffs[id];
  const diffEntries =
    diff &&
    Object.entries(diff)
      .filter(([key]) => key !== "playCount") // ← ここが重要
      .map(([key, newValue]) => {
        const oldValue = (song as any)[key];

        const format = (v: any) => {
          if (v === true) return "公開";
          if (v === false) return "非公開";
          if (v === "" || v === undefined || v === null) return "（なし）";
          return String(v);
        };

        return {
          key,
          oldValue: format(oldValue),
          newValue: format(newValue),
        };
      });

  return (
    <main className="mx-auto max-w-xl px-4 py-6 text-white">

      {/* NEW + ID */}
      <div className="flex items-center gap-3 mb-4">
        {song.isNew && (
          <span className="px-2 py-1 text-xs rounded bg-orange-500 text-white">
            NEW
          </span>
        )}
        <span className="text-sm">ID: {song.id}</span>
      </div>

      {/* タイトル / アーティスト */}
      <h1 className="text-xl font-bold">{song.title} / {song.artist}</h1>

      {/* かな */}
      <p className="text-white/60 text-sm mt-1">
        {song.titleKana || "（なし）"} / {song.artistKana || "（なし）"}
      </p>

      {/* スケール */}
      <p className="text-white/70 text-sm mt-1">
        スケール: {song.scale}
      </p>

      {/* 管理情報 */}
      <div className="mt-6 p-4 rounded-lg bg-white/10 border border-white/20 space-y-1">
        <p>ジャンル: {song.genre || "（なし）"}</p>
        <p>スキル: {song.skillLevel}</p>
        <p>公開: {song.isPublic ? "公開" : "非公開"}</p>
        <p>追加日: {song.createdAt}</p>
        <p>再生回数: {song.playCount}</p>
      </div>

      {/* diff（playCount は絶対に出ない） */}
      {diffEntries && diffEntries.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-white/10 border border-pink-400/40">
          <h2 className="font-bold text-pink-300 mb-2">【未反映の変更】</h2>
          {diffEntries.map((d) => (
            <p key={d.key} className="text-sm">
              ・{d.key}: {d.oldValue} → {d.newValue}
            </p>
          ))}
        </div>
      )}

      {/* ボタン群 */}
      <div className="mt-8 flex gap-3">

        {/* 戻る */}
        <button
          onClick={() => router.push("/admin-kanri")}
          className="
            flex-1 py-3 rounded-lg
            bg-white/10 border border-white/30
            text-white font-bold active:scale-95 transition
          "
        >
          ← 戻る
        </button>

        {/* 編集 */}
        <button
          onClick={() => router.push(`/admin-kanri/edit/${song.id}`)}
          className="
            flex-1 py-3 rounded-lg
            bg-green-400/20 border border-green-300/40
            text-white font-bold
            hover:bg-green-400/30
            active:scale-95 transition
          "
        >
          編集
        </button>

        {/* 歌う */}
        <button
          onClick={handleSing}
          className="
            flex-1 py-3 rounded-lg
            bg-red-400/20 border border-red-300/40
            text-white font-bold
            hover:bg-red-400/30
            active:scale-95 transition
          "
        >
          歌う
        </button>

      </div>
    </main>
  );
}