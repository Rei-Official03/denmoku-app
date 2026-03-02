"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditForm from "@/app/admin-kanri/_components/EditForm";
import type { Song } from "@/lib/songData";

export default function EditSongPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [songs, setSongs] = useState<Song[]>([]);
  const [baseSong, setBaseSong] = useState<Song | null>(null);
  const [loaded, setLoaded] = useState(false);

  // songData 読み込み
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

  // baseSong をセット
  useEffect(() => {
    const base = songs.find((s) => s.id === id) || null;
    setBaseSong(base);
    setLoaded(true);
  }, [id, songs]);

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

  // 初期値（diff → baseSong の順で上書き）
  const initial = {
    title: diff.title ?? baseSong.title,
    titleKana: diff.titleKana ?? baseSong.titleKana,
    artist: diff.artist ?? baseSong.artist,
    artistKana: diff.artistKana ?? baseSong.artistKana,
    scale: diff.scale ?? baseSong.scale,
    genre: diff.genre ?? baseSong.genre,
    instUrl: diff.instUrl ?? baseSong.instUrl,
    skillLevel: diff.skillLevel ?? baseSong.skillLevel,
    isPublic: diff.isPublic ?? baseSong.isPublic,
  };

  // ★ 差分だけ保存する（ここが最重要）
  const handleSave = (data: any) => {
    const diffs = loadDiffs();

    const newDiff: Record<string, unknown> = {};

    // baseSong と比較して “変わった項目だけ” diff に入れる
    for (const key of Object.keys(initial)) {
      const before = (baseSong as any)[key];
      const after = data[key];

      if (before !== after) {
        newDiff[key] = after;
      }
    }

    diffs[id] = newDiff;

    try {
      localStorage.setItem("song_edits_v1", JSON.stringify(diffs));
    } catch {}

    router.push("/admin-kanri");
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