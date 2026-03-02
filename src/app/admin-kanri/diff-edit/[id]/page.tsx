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

  // songData を読み込む
  useEffect(() => {
    import("@/lib/songData").then((mod) => {
      setSongs(mod.songs);
    });
  }, []);

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

  // initial を作る
  useEffect(() => {
    if (songs.length === 0) return;

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

  // ★ 差分だけ保存する（最重要）
  const handleSave = (data: any) => {
    const diffs = loadDiffs();

    const baseSong = songs.find((s) => s.id === id) || null;
    const newDiff: Record<string, unknown> = {};

    // baseSong がある場合 → baseSong と比較して差分だけ保存
    if (baseSong) {
      for (const key of Object.keys(initial)) {
        const before = (baseSong as any)[key];
        const after = data[key];
        if (before !== after) {
          newDiff[key] = after;
        }
      }
    } else {
      // 新規曲の場合 → 全項目保存（diff-edit でも新規曲はあり得る）
      Object.assign(newDiff, data);
    }

    diffs[id] = newDiff;

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