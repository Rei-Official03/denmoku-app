"use client";

import type { Song, SongDiff, SongWithMeta } from "./types";
import { songs as baseSongs } from "./songData";

// playCount 読み込み
function getPlayCount(id: number): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(`play_count_${id}`);
  return raw ? Number(raw) : 0;
}

// diffs: SongDiff[] を前提にした最新版 mergeSongs
export function mergeSongs(
  diffs: SongDiff[] = [],
  base: Song[] = baseSongs
): SongWithMeta[] {
  const diffMap = new Map<number, SongDiff>();
  diffs.forEach((d) => diffMap.set(d.id, d));

  const merged: SongWithMeta[] = [];

  // ① 既存曲に diff を適用
  for (const baseSong of base) {
    const diff = diffMap.get(baseSong.id);

    if (diff) {
      const { id, isNew, ...patch } = diff;

      merged.push({
        ...baseSong,
        ...patch,
        playCount: getPlayCount(baseSong.id),
        hasDiff: true,
      });

      diffMap.delete(baseSong.id);
    } else {
      merged.push({
        ...baseSong,
        playCount: getPlayCount(baseSong.id),
      });
    }
  }

  // ② diff に残っている isNew === true の曲は「新規曲」
  for (const diff of diffMap.values()) {
    if (!diff.isNew) continue;

    const { id, isNew, ...patch } = diff;

    merged.push({
      id,
      title: patch.title ?? "",
      titleKana: patch.titleKana ?? "",
      artist: patch.artist ?? "",
      artistKana: patch.artistKana ?? "",
      genre: patch.genre ?? "",
      scale: patch.scale ?? "",
      instUrl: patch.instUrl ?? "",
      skillLevel: patch.skillLevel ?? "△",
      isPublic: patch.isPublic ?? true,
      createdAt: patch.createdAt ?? new Date().toISOString().slice(0, 10),

      playCount: getPlayCount(id),
      hasDiff: true,
    });
  }

  return merged;
}