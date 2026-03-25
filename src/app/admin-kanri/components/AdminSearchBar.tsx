"use client";

type Props = {
  keyword: string;
  setKeyword: (v: string) => void;

  // ★ 修正ポイント（string → "id" | "name"）
  mode: "id" | "name";
  setMode: (v: "id" | "name") => void;

  onSearch: () => void;
  onAdd: () => void;
  onRandom: () => void;
  onClear: () => void;
};

export default function AdminSearchBar({
  keyword,
  setKeyword,
  mode,
  setMode,
  onSearch,
  onAdd,
  onRandom,
  onClear,
}: Props) {
  return (
    <div className="flex flex-col gap-3 mb-6">

      {/* 1行目：入力欄 + 検索 + 曲追加 */}
      <div className="flex gap-2 items-center">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="ID または 曲名・アーティスト名"
          className="
            flex-1 px-3 py-2 rounded-lg
            bg-white/15 backdrop-blur-md
            placeholder-white/50 text-white
            focus:outline-none focus:ring-2 focus:ring-orange-300/40
            transition
          "
        />

        <button
          onClick={onSearch}
          className="
            px-4 py-2 rounded-lg font-bold text-white
            bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500
            hover:from-orange-400 hover:via-orange-500 hover:to-orange-600
            shadow-sm hover:shadow transition
          "
        >
          検索
        </button>

        <button
          onClick={onAdd}
          className="
            px-4 py-2 rounded-lg font-bold text-white
            bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400
            hover:from-orange-300 hover:via-orange-400 hover:to-orange-500
            shadow-sm hover:shadow transition
          "
        >
          ＋ 曲を追加
        </button>
      </div>

      {/* 2行目：ラジオボタン */}
      <div className="flex gap-6 text-white text-sm font-bold">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="id"
            checked={mode === "id"}
            onChange={() => setMode("id")}
            className="accent-white"
          />
          ID
        </label>

        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="name"
            checked={mode === "name"}
            onChange={() => setMode("name")}
            className="accent-white"
          />
          曲 or アーティスト名
        </label>
      </div>

      {/* 3行目：ランダム + クリア */}
      <div className="flex gap-2">
        <button
          onClick={onRandom}
          className="
            flex-1 px-4 py-2 rounded-lg
            bg-white/10 hover:bg-white/20
            text-sm font-bold transition
          "
        >
          ランダム（◎ × 5）
        </button>

        <button
          onClick={onClear}
          className="
            flex-1 px-4 py-2 rounded-lg
            bg-white/10 hover:bg-white/20
            text-sm font-bold transition
          "
        >
          クリア
        </button>
      </div>
    </div>
  );
}