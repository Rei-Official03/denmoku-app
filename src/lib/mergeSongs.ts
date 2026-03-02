// /lib/mergeSongs.ts
import { songs } from "@/lib/songData";

const isNew = (createdAt: string | null) => {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diff = now - created;
  const days = diff / (1000 * 60 * 60 * 24);
  return days <= 30;
};

// createdAt を安全に正規化する関数
const normalizeDate = (value: any): string | null => {
  if (typeof value === "string" && value.trim() !== "") {
    return value.slice(0, 10);
  }
  return null;
};

export const mergeSongs = (diffs: Record<number, any>) => {
  // ① 既存曲
  const mergedExisting = songs.map((song) => {
    const diff = diffs[song.id];

    // diff がない → そのまま
    if (!diff) {
      const createdAt = normalizeDate(song.createdAt);
      return {
        ...song,
        createdAt,
        isNew: isNew(createdAt),
      };
    }

    // diff がある → 上書き
    const { id, ...restDiff } = diff;

    const createdAt = normalizeDate(
      restDiff.createdAt ?? song.createdAt
    );

    return {
      ...song,
      ...restDiff,
      createdAt,
      isNew: isNew(createdAt),
    };
  });

  // ② 新規曲
  const newSongs = Object.entries(diffs)
    .filter(([id]) => !songs.some((song) => song.id === Number(id)))
    .map(([id, diff]) => {
      const { id: _, ...restDiff } = diff;

      const createdAt = normalizeDate(restDiff.createdAt);

      return {
        id: Number(id),
        ...restDiff,
        createdAt,
        isNew: isNew(createdAt),
      };
    });

  return [...mergedExisting, ...newSongs];
};