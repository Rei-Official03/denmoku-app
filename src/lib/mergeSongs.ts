import type { Song } from "./songData";

// playCount 読み込み
const loadPlayCounts = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("song_playcount_v1");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export function mergeSongs(diffs: Record<number, any>): Song[] {
  // 元データ
  const baseSongs: Song[] = require("./songData").songs;

  // playCount
  const playCounts = loadPlayCounts();

  const merged: Song[] = [];

  // ① 既存曲をマージ
  for (const base of baseSongs) {
    const diff = diffs[base.id] ?? {};

    const song: Song = {
      ...base,

      // ② diff を上書き（undefined は無視）
      title: diff.title ?? base.title,
      titleKana: diff.titleKana ?? base.titleKana,
      artist: diff.artist ?? base.artist,
      artistKana: diff.artistKana ?? base.artistKana,
      scale: diff.scale ?? base.scale,
      genre: diff.genre ?? base.genre,
      instUrl: diff.instUrl ?? base.instUrl,
      skillLevel: diff.skillLevel ?? base.skillLevel,
      isPublic: typeof diff.isPublic === "boolean" ? diff.isPublic : base.isPublic,

      // ③ playCount は diff ではなく専用ストレージから
      playCount: Number(playCounts[base.id] ?? base.playCount ?? 0),

      // ④ diff があるかどうか（playCount は含めない）
      hasDiff: Object.keys(diff).length > 0,

      // ⑤ 新規曲ではない
      isNew: false,
    };

    merged.push(song);
  }

  // ⑥ 新規曲（base に存在しない ID）
  for (const idStr of Object.keys(diffs)) {
    const id = Number(idStr);
    const diff = diffs[id];

    const exists = baseSongs.some((s) => s.id === id);
    if (exists) continue;

    const song: Song = {
      id,
      title: diff.title ?? "",
      titleKana: diff.titleKana ?? "",
      artist: diff.artist ?? "",
      artistKana: diff.artistKana ?? "",
      scale: diff.scale ?? "",
      genre: diff.genre ?? "",
      instUrl: diff.instUrl ?? "",
      skillLevel: diff.skillLevel ?? "",
      isPublic: Boolean(diff.isPublic),

      playCount: Number(playCounts[id] ?? 0),

      hasDiff: true,
      isNew: true,
    };

    merged.push(song);
  }

  return merged;
}