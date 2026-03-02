export function getNextId() {
  if (typeof window === "undefined") return 1;

  try {
    // ① すでに next_id がある場合
    const raw = localStorage.getItem("song_next_id");
    if (raw) {
      const next = Number(raw);
      localStorage.setItem("song_next_id", String(next + 1));
      return next;
    }

    // ② 初回だけ songData と diff から最大 ID を計算
    const baseSongs = require("./songData").songs;
    const maxSongId = Math.max(...baseSongs.map((s) => s.id));

    const rawDiff = localStorage.getItem("song_edits_v1");
    const diffs = rawDiff ? JSON.parse(rawDiff) : {};
    const diffIds = Object.keys(diffs).map((k) => Number(k));
    const maxDiffId = diffIds.length > 0 ? Math.max(...diffIds) : 0;

    const start = Math.max(maxSongId, maxDiffId) + 1;

    // 保存
    localStorage.setItem("song_next_id", String(start + 1));

    return start;
  } catch {
    // ③ localStorage が壊れていた場合の安全策
    const fallback = Date.now();
    localStorage.setItem("song_next_id", String(fallback + 1));
    return fallback;
  }
}