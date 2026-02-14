"use client";

import type { SearchMode } from "../../../lib/searchUtils";

export default function PublicSearchBar({
  keyword,
  setKeyword,
  mode,
  setMode,
  genre,
  setGenre,
  genres,
  onSearch,
  onRandom,
  onClearResults, // ← ★ 追加（PublicPage 側で用意）
}: {
  keyword: string;
  setKeyword: (v: string) => void;
  mode: SearchMode;
  setMode: (v: SearchMode) => void;
  genre: string;
  setGenre: (v: string) => void;
  genres: string[];
  onSearch: () => void;
  onRandom: () => void;
  onClearResults: () => void; // ← ★ 追加
}) {
  return (
    <div className="space-y-3 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md">

      {/* キーワード入力 + クリアボタン */}
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="キーワードを入力"
          className="
            w-full rounded-lg bg-white/20 text-white placeholder-white/50 p-2
            focus:outline-none pr-10
          "
        />

        {/* 入力クリアボタン */}
        {keyword && (
          <button
            onClick={() => setKeyword("")}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              text-white/60 hover:text-white
              text-sm px-1
            "
          >
            ×
          </button>
        )}
      </div>

      {/* モード選択 */}
      <div className="flex items-center gap-4 text-sm text-white/80">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === "all"}
            onChange={() => setMode("all")}
          />
          すべて
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === "title"}
            onChange={() => setMode("title")}
          />
          曲名
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === "artist"}
            onChange={() => setMode("artist")}
          />
          アーティスト
        </label>
      </div>

      {/* ジャンル + 検索結果クリアボタン */}
      <div className="flex items-center gap-3">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="flex-1 rounded-lg bg-white/20 text-white p-2 focus:outline-none"
        >
          <option value="" className="bg-[#1a1a1a] text-white">
            ジャンル（指定なし）
          </option>

          {genres.map((g) => (
            <option
              key={g}
              value={g}
              className="bg-[#1a1a1a] text-white"
            >
              {g}
            </option>
          ))}
        </select>

        {/* ★ 検索結果クリアボタン */}
        <button
          onClick={onClearResults}
          className="
            text-white/60 hover:text-white
            text-xs px-3 py-1 rounded-lg
            bg-white/10 backdrop-blur-sm border border-white/20
            transition
          "
        >
          クリア
        </button>
      </div>

      {/* 検索 & ランダム */}
      <div className="flex gap-3">
        <button
          onClick={onSearch}
          className="
            flex-1 py-2 rounded-lg font-bold text-white
            bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200
            hover:from-sky-500 hover:via-sky-400 hover:to-sky-300
            transition
          "
        >
          検索
        </button>

        <button
          onClick={onRandom}
          className="
            flex-1 py-2 rounded-lg font-bold text-white
            bg-gradient-to-r from-sky-200 via-sky-300 to-sky-400
            hover:from-sky-300 hover:via-sky-400 hover:to-sky-500
            transition
          "
        >
          ランダム
        </button>
      </div>
    </div>
  );
}