// searchUtils.ts
// Cosmic Lounge 用：曲データの検索ユーティリティ

import type { Song, SongWithMeta } from "@/lib/types";

// --------------------------------------
// 正規化（検索の揺れを吸収）
// --------------------------------------
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s　]/g, "") // 空白除去
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    ) // 全角英数字 → 半角
    .replace(/ヴ/g, "ゔ") // カタカナ揺れ吸収
    .replace(/[ァ-ン]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0x60)
    ) // カタカナ → ひらがな
    .replace(/ー/g, "") // 長音の揺れ吸収
    .replace(/♯/g, "#") // シャープ統一
    .replace(/♭/g, "b"); // フラット統一
}

// --------------------------------------
// Public 用：検索モード型
// --------------------------------------
export type SearchMode = "title" | "artist" | "all";

// --------------------------------------
// Public 用：メイン検索
// --------------------------------------
export function searchSongs(
  songs: (Song | SongWithMeta)[],
  query: string,
  mode: SearchMode
): (Song | SongWithMeta)[] {
  if (!query.trim()) return songs;

  const q = normalize(query);

  return songs.filter((song) => {
    if (mode === "title") {
      return (
        normalize(song.title).includes(q) ||
        normalize(song.titleKana).includes(q)
      );
    }

    if (mode === "artist") {
      return (
        normalize(song.artist).includes(q) ||
        normalize(song.artistKana).includes(q)
      );
    }

    // mode === "all"
    return (
      normalize(song.title).includes(q) ||
      normalize(song.titleKana).includes(q) ||
      normalize(song.artist).includes(q) ||
      normalize(song.artistKana).includes(q) ||
      normalize(song.genre).includes(q) ||
      normalize(song.scale).includes(q)
    );
  });
}

// --------------------------------------
// Admin 用：ID 検索（完全一致）
// --------------------------------------
export function searchAdminById(
  songs: (Song | SongWithMeta)[],
  query: string
): (Song | SongWithMeta)[] {
  const q = query.trim();
  if (!q) return [];

  return songs.filter((song) => song.id.toString() === q);
}

// --------------------------------------
// Admin 用：名前検索（titleKana / artistKana のみ）
// --------------------------------------
export function searchAdminByName(
  songs: (Song | SongWithMeta)[],
  query: string
): (Song | SongWithMeta)[] {
  const q = normalize(query);
  if (!q) return [];

  return songs.filter((song) => {
    return (
      normalize(song.titleKana).includes(q) ||
      normalize(song.artistKana).includes(q)
    );
  });
}

// --------------------------------------
// 公開曲のみ（Public / Admin 共通）
// --------------------------------------
export function filterPublicSongs(songs: (Song | SongWithMeta)[]) {
  return songs.filter((s) => s.isPublic);
}

// --------------------------------------
// ジャンル一覧（Public 用）
// --------------------------------------
export function getGenres(songs: (Song | SongWithMeta)[]): string[] {
  const set = new Set<string>();
  songs.forEach((s) => set.add(s.genre));
  return Array.from(set).sort();
}

// --------------------------------------
// スケール表記の正規化（UI用）
// --------------------------------------
export function normalizeScale(scale: string): string {
  return scale
    .replace(/♯/g, "#")
    .replace(/♭/g, "b")
    .replace(/\s+/g, " ");
}