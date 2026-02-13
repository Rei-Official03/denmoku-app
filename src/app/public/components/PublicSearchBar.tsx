"use client";

import type { SearchMode } from "../searchUtils";

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
}) {
  return (
    <div className="space-y-3 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md">

      {/* キーワード入力 */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="キーワードを入力"
        className="w-full rounded-lg bg-white/20 text-white placeholder-white/50 p-2 focus:outline-none"
      />

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

      {/* ジャンル */}
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full rounded-lg bg-white/20 text-white p-2 focus:outline-none"
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

      {/* ボタン */}
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