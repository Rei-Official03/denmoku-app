"use client";

import { useEffect, useState, useCallback } from "react";
import DiffCard from "./DiffCard";

type DiffMap = Record<string, Record<string, unknown>>;

export default function DiffList() {
  const [diffs, setDiffs] = useState<DiffMap>({});

  // localStorage 読み込み
  const reload = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem("song_edits_v1");
      const obj = raw ? (JSON.parse(raw) as DiffMap) : {};
      setDiffs(obj);
    } catch {
      setDiffs({});
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const ids = Object.keys(diffs).sort((a, b) => Number(a) - Number(b));

  if (ids.length === 0) {
    return (
      <div className="mt-8 text-white/60 text-sm">
        🎉 現在、未反映の差分はありません
      </div>
    );
  }

  // 全削除
  const clearAll = () => {
    const ok = confirm(
      "すべての差分を削除しますか？\n(songData.ts に反映済みの場合のみ実行してください)"
    );
    if (!ok) return;

    try {
      localStorage.setItem("song_edits_v1", JSON.stringify({}));
    } catch {}

    reload();
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/80 text-sm">
          ⚠ 未反映の差分: {ids.length}
        </div>

        <button
          onClick={clearAll}
          className="
            text-[11px] px-3 py-1 rounded-full
            bg-gradient-to-r from-red-300 via-red-400 to-red-500
            hover:from-red-400 hover:via-red-500 hover:to-red-600
            text-white font-bold shadow-sm hover:shadow transition
          "
        >
          全ての差分を削除
        </button>
      </div>

      <div className="space-y-3">
        {ids.map((id) => (
          <DiffCard
            key={id}
            id={Number(id)}
            patch={diffs[id]}   // ← diff の中身を正しく渡す
            onCleared={reload}  // ← 削除後に再読み込み
          />
        ))}
      </div>
    </div>
  );
}