"use client";

type Props = {
  keyword: string;
  setKeyword: (v: string) => void;
  onSearch: () => void;
  onAdd: () => void;
};

export default function AdminSearchBar({
  keyword,
  setKeyword,
  onSearch,
  onAdd,
}: Props) {
  return (
    <div className="flex gap-2 mb-6 items-center">
      {/* 入力欄 */}
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="ID or 曲・アーティスト名をひらがなで入力"
        className="
          flex-1 px-3 py-2 rounded-lg
          bg-white/15 backdrop-blur-md
          placeholder-white/50 text-white
          focus:outline-none focus:ring-2 focus:ring-orange-300/40
          transition
        "
      />

      {/* 検索ボタン */}
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

      {/* 曲追加ボタン */}
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
  );
}