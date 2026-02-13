// searchUtils.ts
// Cosmic Lounge 用：曲データの検索ユーティリティ

import type { Song } from "@/lib/songData";

// --------------------------------------
// 正規化（検索の揺れを吸収）
// --------------------------------------
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s　]/g, "")        // 空白除去
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    )                              // 全角英数字 → 半角
    .replace(/ヴ/g, "ゔ")          // カタカナ揺れ吸収
    .replace(/[ァ-ン]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0x60)
    )                              // カタカナ → ひらがな
    .replace(/ー/g, "")            // 長音の揺れ吸収
    .replace(/♯/g, "#")            // シャープ統一
    .replace(/♭/g, "b");           // フラット統一
}

// --------------------------------------
// メイン検索（あいまい検索）
// --------------------------------------
export function searchSongs(songs: Song[], query: string): Song[] {
  if (!query.trim()) return songs;

  const q = normalize(query);

  return songs.filter((song) => {
    const fields = [
      song.title,
      song.titleKana,
      song.artist,
      song.artistKana,
      song.genre,
      song.scale,
    ];

    return fields.some((f) => normalize(f).includes(q));
  });
}

// --------------------------------------
// 公開曲のみを返す（isPublic && instUrl）
// --------------------------------------
export function filterPublicSongs(songs: Song[]): Song[] {
  return songs.filter((s) => s.isPublic && !!s.instUrl);
}

// --------------------------------------
// ジャンル一覧を生成（重複なし）
// ※ "ALL" は UI 側で扱うため追加しない
// --------------------------------------
export function getGenres(songs: Song[]): string[] {
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

// --------------------------------------
// 検索モード型（UI用）
// --------------------------------------
export type SearchMode = "title" | "artist" | "all";