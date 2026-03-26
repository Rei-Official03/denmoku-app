"use client";

import { useEffect, useState } from "react";
import DiffCard from "./DiffCard";

import { loadDiffs, saveDiffs, subscribeDiffs } from "@/lib/diffStorage";
import type { SongDiff } from "@/lib/types";

export default function DiffList() {
  const [diffs, setDiffs] = useState<SongDiff[]>([]);

  // diff を読み込む
  const reload = () => {
    const loaded = loadDiffs();
    setDiffs(loaded);
  };

  // 初回 + diff 更新イベント購読
  useEffect(() => {
    reload();
    const unsubscribe = subscribeDiffs(reload);
    return () => unsubscribe();
  }, []);

  // ID 昇順
  const sorted = [...diffs].sort((a, b) => a.id - b.id);

  if (sorted.length === 0) {
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

    saveDiffs([]); // ★ diffStorage を使う
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/80 text-sm">
          ⚠ 未反映の差分: {sorted.length}
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
        {sorted.map((diff) => (
          <DiffCard
            key={diff.id}
            id={diff.id}
            patch={diff}      // ★ SongDiff をそのまま渡す
            onCleared={reload}
          />
        ))}
      </div>
    </div>
  );
}