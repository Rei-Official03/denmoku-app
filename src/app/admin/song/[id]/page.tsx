"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { songs } from "@/lib/songData";
import { useRouter } from "next/navigation";

export default function SongDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const song = songs.find((s) => s.id === id);

  const [isEditing, setIsEditing] = useState(false);

  // ★ 再生回数
  const [playCount, setPlayCount] = useState(0);

  // 初回読み込みで localStorage から読み込む
  useEffect(() => {
    const raw = localStorage.getItem(`play_count_${id}`);
    setPlayCount(raw ? Number(raw) : 0);
  }, [id]);

  // 歌うボタン押したとき
  const handlePlay = () => {
    const newCount = playCount + 1;
    setPlayCount(newCount);
    localStorage.setItem(`play_count_${id}`, String(newCount));
  };

  // 編集用 state
  const [title, setTitle] = useState(song?.title ?? "");
  const [titleKana, setTitleKana] = useState(song?.titleKana ?? "");
  const [artist, setArtist] = useState(song?.artist ?? "");
  const [artistKana, setArtistKana] = useState(song?.artistKana ?? "");
  const [scale, setScale] = useState(song?.scale ?? "");
  const [genre, setGenre] = useState(song?.genre ?? "");
  const [skillLevel, setSkillLevel] = useState(song?.skillLevel ?? "");
  const [isPublic, setIsPublic] = useState(song?.isPublic ?? false);

  const loadDiffs = () => {
    const raw = localStorage.getItem("song_edits_v1");
    return raw ? JSON.parse(raw) : {};
  };

  const saveDiffs = (obj: any) => {
    localStorage.setItem("song_edits_v1", JSON.stringify(obj));
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
      <main className="p-6 text-white">
        曲が見つかりませんでした（ID: {id}）
      </main>
    );
  }

  return (
    <main className="p-6 text-white space-y-6">
      <h1 className="text-xl font-bold">{song.title}</h1>
      <p className="text-white/70">{song.artist}</p>

      {/* ★ 再生回数表示 */}
      <div className="text-sm text-white/60">
        再生回数：{playCount} 回
      </div>

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
  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition backdrop-blur-sm"
>
  ← 戻る
</button>
            <a
  href={song.instUrl}
  target="_blank"
  rel="noopener noreferrer"
  onMouseDown={handlePlay}
  className="px-4 py-2 rounded-lg bg-orange-400/20 hover:bg-orange-400/30 transition backdrop-blur-sm text-orange-200"
>
  歌う
</a>

            <button
  onClick={() => setIsEditing(true)}
  className="px-4 py-2 rounded-lg bg-green-400/20 hover:bg-green-400/30 transition backdrop-blur-sm text-green-200"
>
  編集
</button>
          </div>
        </>
      )}

      {/* 編集モード */}
      {isEditing && (
        <div className="space-y-4">
          {/* ここはそのまま */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/20"
          />

          {/* 以下略… */}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
          >
            保存
          </button>
        </div>
      )}
    </main>
  );
}