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

  // データ読み込み（mergeSongs）
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

  // 歌うボタン
  const handleSing = () => {
  const hasUrl =
    typeof song.instUrl === "string" && song.instUrl.trim() !== "";

  // URL がある場合 → URL を開くだけ（コピーしない）
  if (hasUrl) {
    window.open(song.instUrl, "_blank");
    return;
  }

  // URL がない場合 → YouTube ホーム + コピー
  window.open("https://www.youtube.com/", "_blank");
  navigator.clipboard.writeText(`${song.title} カラオケ`);
};

  // Diff の元 → 新 を作る
  const diff = diffs[id];
  const diffEntries =
    diff &&
    Object.entries(diff).map(([key, newValue]) => {
      const oldValue = (song as any)[key];

      // 表示用の変換
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
      {/* タイトル */}
      <h1 className="text-2xl font-bold">{song.title}</h1>
      <p className="text-white/70">{song.artist}</p>

      {/* NEW バッジ */}
      {song.isNew && (
        <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-pink-500 text-white">
          NEW
        </span>
      )}

      {/* 管理情報カード */}
      <div className="mt-6 p-4 rounded-lg bg-white/10 border border-white/20">
        <p>ID: {song.id}</p>
        <p>タイトル（かな）: {song.titleKana || "（なし）"}</p>
        <p>アーティスト（かな）: {song.artistKana || "（なし）"}</p>
        <p>ジャンル: {song.genre || "（なし）"}</p>
        <p>スキル: {song.skillLevel}</p>
        <p>公開: {song.isPublic ? "公開" : "非公開"}</p>
        <p>追加日: {song.createdAt}</p>
        <p>instURL: {song.instUrl || "（なし）"}</p>
        <p>再生回数: {song.playCount}</p>
      </div>

      {/* Diff 表示 */}
      {diff && (
        <div className="mt-6 p-4 rounded-lg bg-white/10 border border-pink-400/40">
          <h2 className="font-bold text-pink-300 mb-2">【未反映の変更】</h2>
          {diffEntries?.map((d) => (
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
          className="flex-1 py-3 rounded-lg bg-white/10 border border-white/30 text-white font-bold active:scale-95 transition"
        >
          ← 戻る
        </button>

        {/* 編集 */}
        <button
          onClick={() => router.push(`/admin-kanri/edit/${song.id}`)}
          className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-bold active:scale-95 transition"
        >
          編集
        </button>

        {/* 歌う */}
        <button
          onClick={handleSing}
          className="flex-1 py-3 rounded-lg bg-pink-500 text-white font-bold active:scale-95 transition"
        >
          歌う
        </button>
      </div>
    </main>
  );
}