"use client";

import { useEffect, useState } from "react";
import { songs as baseSongs } from "./songData";
import { loadDiffs, subscribeDiffs } from "./diffStorage";
import { mergeSongs } from "./mergeSongs";
import type { SongWithMeta } from "./types";

export function useMergedSongs(): SongWithMeta[] {
  const [merged, setMerged] = useState<SongWithMeta[]>([]);

  useEffect(() => {
    // 最新の merged songs を再計算する関数
    const recompute = () => {
      const diffs = loadDiffs();
      const mergedSongs = mergeSongs(baseSongs, diffs);
      setMerged(mergedSongs);
    };

    // 初回計算
    recompute();

    // diff 更新イベントを購読
    const unsubscribe = subscribeDiffs(recompute);

    // クリーンアップ
    return () => unsubscribe();
  }, []);

  return merged;
}