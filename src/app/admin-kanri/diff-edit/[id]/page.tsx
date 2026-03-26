"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import EditForm from "@/app/admin-kanri/_components/EditForm";
import { loadDiffs, saveDiffs } from "@/lib/diffStorage";
import type { SongDiff } from "@/lib/types";

export default function DiffEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [initial, setInitial] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  // diffStorage から初期値を作る
  useEffect(() => {
    const diffs = loadDiffs();
    const diff = diffs.find((d) => d.id === id) || null;

    setInitial({
      title: diff?.title ?? "",
      titleKana: diff?.titleKana ?? "",
      artist: diff?.artist ?? "",
      artistKana: diff?.artistKana ?? "",
      scale: diff?.scale ?? "",
      genre: diff?.genre ?? "",
      instUrl: diff?.instUrl ?? "",
      skillLevel: diff?.skillLevel ?? "",
      isPublic: diff?.isPublic ?? false,
    });

    setLoaded(true);
  }, [id]);

  // 保存（diffStorage に直接保存）
  const handleSave = (data: any) => {
    const diffs = loadDiffs();

    const patch: SongDiff = {
      id,
      ...data,
    };

    const updated = [
      ...diffs.filter((d) => d.id !== id),
      patch,
    ];

    saveDiffs(updated);

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
      titleLabel="差分を編集"
      onSave={handleSave}
    />
  );
}