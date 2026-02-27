// /lib/mergeSongs.ts
import { songs } from "@/lib/songData";

const isNew = (createdAt: string) => {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diff = now - created;
  const days = diff / (1000 * 60 * 60 * 24);
  return days <= 30;
};

export const mergeSongs = (diffs: Record<number, any>) => {
  // ① 既存曲
  const mergedExisting = songs.map((song) => {
    const diff = diffs[song.id];

    // diff がない → そのまま
    if (!diff) {
      const createdAt = song.createdAt.slice(0, 10);
      return {
        ...song,
        createdAt,
        isNew: isNew(createdAt),
      };
    }

    // diff がある → 上書き
    const { id, ...restDiff } = diff;

    const createdAt = (restDiff.createdAt ?? song.createdAt).slice(0, 10);

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

      const createdAt = restDiff.createdAt.slice(0, 10);

      return {
        id: Number(id),
        ...restDiff,
        createdAt,
        isNew: isNew(createdAt),
      };
    });

  return [...mergedExisting, ...newSongs];
};