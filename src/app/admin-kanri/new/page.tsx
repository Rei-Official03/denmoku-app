"use client";

import { useRouter, useSearchParams } from "next/navigation";
import EditForm from "@/app/admin-kanri/_components/EditForm";
import { getNextId } from "@/lib/getNextId";
import { supabase } from "@/lib/supabase";

import { loadDiffs, saveDiffs } from "@/lib/diffStorage";
import type { SongDiff } from "@/lib/types";

export default function NewSongPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestId = searchParams.get("id");

  // リクエストから初期値を受け取る
  const initial = {
    title: searchParams.get("title") || "",
    titleKana: "",
    artist: searchParams.get("artist") || "",
    artistKana: "",
    scale: "",
    genre: "",
    instUrl: "",
    skillLevel: "",
    isPublic: false,
  };

  // ★ 新規曲保存
  const handleSave = async (data: any) => {
    const id = getNextId(); // 新規ID採番

    const diffs = loadDiffs();

    const patch: SongDiff = {
      id,
      isNew: true, // ★ 新規曲フラグ（必須）
      ...data,
    };

    const updated = [...diffs, patch];

    saveDiffs(updated);

    // ★ リクエストから来た場合は削除
    if (requestId) {
      await supabase.from("request").delete().eq("id", requestId);
    }

    router.push("/admin-kanri");
  };

  return (
    <EditForm
      id={0} // 表示用（新規曲）
      initial={initial}
      titleLabel="新規曲を追加"
      onSave={handleSave}
    />
  );
}