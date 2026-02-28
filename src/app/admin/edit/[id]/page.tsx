"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditForm from "@/app/admin/_components/EditForm";

type Song = {
  id: number;
  title: string;
  titleKana: string;
  artist: string;
  artistKana: string;
  genre: string;
  scale: string;
  instUrl: string;
  skillLevel: string;
  isPublic: boolean;
  createdAt: string;
};

export default function EditSongPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [songs, setSongs] = useState<Song[]>([]);
  const [baseSong, setBaseSong] = useState<Song | null>(null);
  const [loaded, setLoaded] = useState(false);

  // ★ クライアント側で songData を読み込む
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

  useEffect(() => {
    const diffs = loadDiffs();
    const diff = diffs[id];

    const base = songs.find((s) => s.id === id) || null;
    setBaseSong(base);

    setLoaded(true);
  }, [id, songs]);

  const handleSave = (data: any) => {
    const diffs = loadDiffs();
    diffs[id] = data;

    try {
      localStorage.setItem("song_edits_v1", JSON.stringify(diffs));
    } catch {}

    router.push("/admin");
  };

  if (!loaded) {
    return (
      <main className="mx-auto max-w-xl px-4 py-6 text-white">
        読み込み中...
      </main>
    );
  }

  if (!baseSong) {
    return (
      <main className="mx-auto max-w-xl px-4 py-6 text-white">
        <div className="text-white/70">
          この ID の楽曲は存在しません（ID: {id}）
        </div>
      </main>
    );
  }

  const diffs = loadDiffs();
  const diff = diffs[id] ?? {};

  const initial = {
    title: diff.title ?? baseSong.title ?? "",
    titleKana: diff.titleKana ?? baseSong.titleKana ?? "",
    artist: diff.artist ?? baseSong.artist ?? "",
    artistKana: diff.artistKana ?? baseSong.artistKana ?? "",
    scale: diff.scale ?? baseSong.scale ?? "",
    genre: diff.genre ?? baseSong.genre ?? "",
    instUrl: diff.instUrl ?? baseSong.instUrl ?? "",
    skillLevel: diff.skillLevel ?? baseSong.skillLevel ?? "",
    isPublic: diff.isPublic ?? baseSong.isPublic ?? false,
  };

  return (
    <EditForm
      id={id}
      initial={initial}
      onSave={handleSave}
      titleLabel="曲を編集"
    />
  );
}