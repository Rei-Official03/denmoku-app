"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Song } from "@/lib/songData";

export default function SongDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [songs, setSongs] = useState<Song[]>([]);
  const [song, setSong] = useState<Song | null>(null);

  // 曲データ読み込み
  useEffect(() => {
    import("@/lib/songData").then((mod) => {
      setSongs(mod.songs);
    });
  }, []);

  // 対象曲をセット
  useEffect(() => {
    if (songs.length === 0) return;
    const s = songs.find((s) => s.id === id) || null;
    setSong(s);
  }, [songs, id]);

  // 編集モード
  const [isEditing, setIsEditing] = useState(false);

  // 再生回数
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

  // 編集用 state
  const [title, setTitle] = useState("");
  const [titleKana, setTitleKana] = useState("");
  const [artist, setArtist] = useState("");
  const [artistKana, setArtistKana] = useState("");
  const [scale, setScale] = useState("");
  const [genre, setGenre] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // 編集フォームに反映
  useEffect(() => {
    if (!song) return;

    setTitle(song.title);
    setTitleKana(song.titleKana);
    setArtist(song.artist);
    setArtistKana(song.artistKana);
    setScale(song.scale);
    setGenre(song.genre);
    setSkillLevel(song.skillLevel);
    setIsPublic(song.isPublic);
  }, [song]);

  // 差分保存
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
      <main className="mx-auto max-w-xl px-4 py-6 text-white">
        曲が見つかりませんでした（ID: {id}）
      </main>
    );
  }

  // 歌うボタン
  const handleSing = () => {
    handlePlay();

    const url =
      typeof song.instUrl === "string" && song.instUrl.trim() !== ""
        ? song.instUrl
        : "https://www.youtube.com/";

    window.open(url, "_blank");
    navigator.clipboard.writeText(`${song.title} ${song.artist} カラオケ`);
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-6 text-white">
      <h1 className="text-xl font-bold">{song.title}</h1>
      <p className="text-white/70">{song.artist}</p>

      {/* 再生回数 */}
      <p className="mt-2 text-sm text-white/60">
        再生回数：{playCount}
      </p>

      {/* 🎤 歌うボタン */}
      <button
        onClick={handleSing}
        className="mt-4 w-full py-3 rounded-lg bg-pink-500 text-white font-bold shadow-md active:scale-95 transition"
      >
        🎤 歌う
      </button>

      {/* ✏️ 編集ボタン */}
      <button
        onClick={() => setIsEditing(true)}
        className="mt-3 w-full py-3 rounded-lg bg-white/20 text-white font-bold shadow-md active:scale-95 transition"
      >
        ✏️ 編集する
      </button>
    </main>
  );
}