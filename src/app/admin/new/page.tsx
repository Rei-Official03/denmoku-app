"use client";

import { useSearchParams, useRouter } from "next/navigation";
import EditForm from "@/app/admin/_components/EditForm";
import { songs } from "@/lib/songData"; // ★ ここから本物の曲データを参照する

export default function NewSongPage() {
  const params = useSearchParams();
  const router = useRouter();

  const initialTitle = params.get("title") || "";
  const initialArtist = params.get("artist") || "";

  // diff 読み書き
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

  // ★ 本物の nextId を計算する
  const getNextId = () => {
    if (typeof window === "undefined") return 1;

    // ① songData 側の最大 ID
    const maxSongId =
      songs.length > 0 ? Math.max(...songs.map((s) => s.id)) : 0;

    // ② diff 側の最大 ID（新規曲や編集済みがあればここに入る）
    let maxDiffId = 0;
    try {
      const raw = localStorage.getItem("song_edits_v1");
      const diffs = raw ? JSON.parse(raw) : {};
      const diffIds = Object.keys(diffs).map((k) => Number(k));
      maxDiffId = diffIds.length > 0 ? Math.max(...diffIds) : 0;
    } catch {
      maxDiffId = 0;
    }

    // ③ 両方の最大値 + 1 が nextId
    return Math.max(maxSongId, maxDiffId) + 1;
  };

  // EditForm の初期値
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

  // 保存処理：ここで初めて ID を決める
  const handleSave = (data: any) => {
    const id = getNextId(); // ← ここが 96 になる

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
      id={0} // 表示用だけ。採番は handleSave 側でやる
      initial={initial}
      onSave={handleSave}
      titleLabel="新規曲追加"
    />
  );
}