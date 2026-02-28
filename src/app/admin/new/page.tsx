"use client";

import { useSearchParams, useRouter } from "next/navigation";
import EditForm from "@/app/admin/_components/EditForm";

// ★ クライアント側で安全に読み込むために dynamic import に変更
import { useEffect, useState } from "react";

export default function NewSongPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [songs, setSongs] = useState([]);

  // ★ クライアント側で songData を読み込む
  useEffect(() => {
    import("@/lib/songData").then((mod) => {
      setSongs(mod.songs);
    });
  }, []);

  const initialTitle = params.get("title") || "";
  const initialArtist = params.get("artist") || "";

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

  const getNextId = () => {
    if (typeof window === "undefined") return 1;

    const maxSongId =
      songs.length > 0 ? Math.max(...songs.map((s: any) => s.id)) : 0;

    let maxDiffId = 0;
    try {
      const raw = localStorage.getItem("song_edits_v1");
      const diffs = raw ? JSON.parse(raw) : {};
      const diffIds = Object.keys(diffs).map((k) => Number(k));
      maxDiffId = diffIds.length > 0 ? Math.max(...diffIds) : 0;
    } catch {
      maxDiffId = 0;
    }

    return Math.max(maxSongId, maxDiffId) + 1;
  };

  const initial = {
    title: initialTitle,
    titleKana: "",
    artist: initialArtist,
    artistKana: "",
    scale: "",
    genre: "",
    instUrl: "",
    skillLevel: "",
    isPublic: false,
  };

  const handleSave = (data: any) => {
    const id = getNextId();

    const diffs = loadDiffs();
    diffs[id] = {
      id,
      ...data,
    };
    saveDiffs(diffs);

    router.push("/admin");
  };

  return (
    <EditForm
      id={0}
      initial={initial}
      onSave={handleSave}
      titleLabel="新規曲追加"
    />
  );
}