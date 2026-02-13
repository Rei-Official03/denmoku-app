"use client";

import { useEffect, useState } from "react";
import DiffCard from "./DiffCard";

type DiffMap = Record<string, Record<string, unknown>>;

export default function DiffList() {
  const [diffs, setDiffs] = useState<DiffMap>({});

  const reload = () => {
    const raw = localStorage.getItem("song_edits_v1");
    setDiffs(raw ? JSON.parse(raw) : {});
  };

  useEffect(() => {
    reload();
  }, []);

  const ids = Object.keys(diffs).sort((a, b) => Number(a) - Number(b));

  if (ids.length === 0) return null;

  const clearAll = () => {
    const ok = confirm(
      "Have you already merged ALL diffs into songData.ts?\nThis cannot be undone."
    );
    if (!ok) return;
    localStorage.setItem("song_edits_v1", JSON.stringify({}));
    reload();
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <div className="text-white/80 text-sm">
          ⚠ 未反映: {ids.length}
        </div>
        <button
          onClick={clearAll}
          className="text-[11px] px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
        >
          全ての差分を削除
        </button>
      </div>

      <div className="space-y-3">
        {ids.map((id) => (
          <DiffCard
            key={id}
            id={id}
            patch={diffs[id]}
            onCleared={reload}
          />
        ))}
      </div>
    </div>
  );
}