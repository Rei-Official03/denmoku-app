"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditForm from "@/app/admin-kanri/_components/EditForm";
import type { Song } from "@/lib/songData";

export default function DiffEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [songs, setSongs] = useState<Song[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [initial, setInitial] = useState<any>(null);

  // ① songData を読み込む
  useEffect(() => {
    import("@/lib/songData").then((mod) => {
      setSongs(mod.songs);
    });
  }, []);

  const loadDiffs = () => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("song_edits_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  // ② songs が読み込まれてから initial を作る
  useEffect(() => {
    if (songs.length === 0) return; // ← songs が来るまで待つ

    const diffs = loadDiffs();
    const diff = diffs[id] ?? {};

    const baseSong = songs.find((song) => song.id === id);

    // 新規曲（songData に存在しない ID）
    if (!baseSong) {
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
      // 既存曲 → diff を上書きしてマージ
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
  }, [id, songs]);

  const handleSave = (data: any) => {
    const diffs = loadDiffs();

    const { id: _, ...rest } = data;
    diffs[id] = rest;

    try {
      localStorage.setItem("song_edits_v1", JSON.stringify(diffs));
    } catch {}

    router.push("/admin-kanri");
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