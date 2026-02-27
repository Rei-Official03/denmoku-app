// searchUtils.ts
// Cosmic Lounge 用：曲データの検索ユーティリティ

import type { Song } from "@/lib/songData";

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
// 検索モード型（UI用）
// --------------------------------------
export type SearchMode = "title" | "artist" | "all";

// --------------------------------------
// メイン検索（mode 対応版）
// --------------------------------------
export function searchSongs(
  songs: Song[],
  query: string,
  mode: SearchMode
): Song[] {
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
// 公開曲のみを返す（isPublic のみ判定）
// instUrl が undefined / 空 でも絶対に落ちない安全版
// --------------------------------------
export function filterPublicSongs(songs: Song[]): Song[] {
  return songs.filter((s) => s.isPublic);
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