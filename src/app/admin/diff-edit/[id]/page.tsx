"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditForm from "@/app/admin/_components/EditForm";
import { songs } from "@/lib/songData"; // ★ 既存曲データ

export default function DiffEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loaded, setLoaded] = useState(false);
  const [initial, setInitial] = useState<any>(null);

  // localStorage 読み込み
  const loadDiffs = () => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("song_edits_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  useEffect(() => {
    const diffs = loadDiffs();
    const diff = diffs[id] ?? {};

    // ★ 新規曲判定（songData に存在しない ID）
    const isNewSong = !songs.some((song) => song.id === id);

    if (isNewSong) {
      // ★ 新規曲モード
      setInitial({
        title: diff.title ?? "",
        titleKana: diff.titleKana ?? "",
        artist: diff.artist ?? "",
        artistKana: diff.artistKana ?? "",
        scale: diff.scale ?? "",
        genre: diff.genre ?? "",
        instUrl: diff.instUrl ?? "",
        skillLevel: diff.skillLevel ?? "",
        isPublic: diff.isPublic ?? false,
      });
   } else {
  const baseSong = songs.find((song) => song.id === id)!;


      setInitial({
        title: diff.title ?? baseSong.title,
        titleKana: diff.titleKana ?? baseSong.titleKana,
        artist: diff.artist ?? baseSong.artist,
        artistKana: diff.artistKana ?? baseSong.artistKana,
        scale: diff.scale ?? baseSong.scale,
        genre: diff.genre ?? baseSong.genre,
        instUrl: diff.instUrl ?? baseSong.instUrl,
        skillLevel: diff.skillLevel ?? baseSong.skillLevel,
        isPublic: diff.isPublic ?? baseSong.isPublic,
      });
    }

    setLoaded(true);
  }, [id]);

  // 保存処理（新規曲も既存曲も diff に保存）
const handleSave = (data: any) => {
  const diffs = loadDiffs();

  // ★ data から id を除外する
  const { id: _, ...rest } = data;

  diffs[id] = rest;

  try {
    localStorage.setItem("song_edits_v1", JSON.stringify(diffs));
  } catch {}

  router.push("/admin");
};

  if (!loaded || !initial) {
    return (
      <main className="mx-auto max-w-xl px-4 py-6 text-white">
        読み込み中...
      </main>
    );
  }

  return (
    <EditForm
      key={id}
      id={id}
      initial={initial}
      onSave={handleSave}
      titleLabel="差分を編集"
    />
  );
}