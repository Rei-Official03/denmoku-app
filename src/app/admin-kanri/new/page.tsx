"use client";

import { useRouter, useSearchParams } from "next/navigation";
import EditForm from "@/app/admin-kanri/_components/EditForm";
import { getNextId } from "@/lib/getNextId";
import { supabase } from "@/lib/supabase";

const loadDiffs = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("song_edits_v1");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveDiffs = (diffs: any) => {
  try {
    localStorage.setItem("song_edits_v1", JSON.stringify(diffs));
  } catch {}
};

export default function NewSongPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestId = searchParams.get("id");

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

  const handleSave = async (data: any) => {
    const id = getNextId();

    const diffs = loadDiffs();
    diffs[id] = { ...data };
    saveDiffs(diffs);

    // ★ 保存成功したら request を静かに削除（confirm なし）
    if (requestId) {
      await supabase.from("request").delete().eq("id", requestId);
    }

    router.push("/admin-kanri");
  };

  return (
    <EditForm
      id={0}
      initial={initial}
      onSave={handleSave}
      titleLabel="新規曲を追加"
    />
  );
}