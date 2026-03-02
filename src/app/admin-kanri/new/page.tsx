"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import EditForm from "@/app/admin-kanri/_components/EditForm";
import { getNextId } from "@/lib/getNextId";

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

// diff 保存
const saveDiffs = (diffs: any) => {
  try {
    localStorage.setItem("song_edits_v1", JSON.stringify(diffs));
  } catch {}
};

export default function NewSongPage() {
  const router = useRouter();

  // 新規曲の初期値
  const initial = {
    title: "",
    titleKana: "",
    artist: "",
    artistKana: "",
    scale: "",
    genre: "",
    instUrl: "",
    skillLevel: "",
    isPublic: false,
  };

  // ★ ここに handleSave を入れる（ID 採番の完全版）
  const handleSave = (data: any) => {
    const id = getNextId(); // ← ここで新規IDを採番

    const diffs = loadDiffs();

    // ★ diff の中に id を入れない（重要）
    diffs[id] = { ...data };

    saveDiffs(diffs);

    router.push("/admin-kanri");
  };

  return (
    <EditForm
      id={0} // 新規曲なので 0（表示用）
      initial={initial}
      onSave={handleSave}
      titleLabel="新規曲を追加"
    />
  );
}