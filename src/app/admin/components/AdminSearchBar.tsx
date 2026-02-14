"use client";

type Props = {
  keyword: string;
  setKeyword: (v: string) => void;
  onSearch: () => void;
  onAdd: () => void; // ← ここを onAdd に統一
};

export default function AdminSearchBar({
  keyword,
  setKeyword,
  onSearch,
  onAdd, // ← ここも onAdd に統一
}: Props) {
  return (
    <div className="flex gap-2 mb-6">
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="曲名・アーティスト名をひらがなで検索"
        className="flex-1 px-3 py-2 rounded-lg bg-white/15 backdrop-blur-md placeholder-white/50 text-white"
      />

      <button
        onClick={onSearch}
        className="
          px-4 py-2 rounded-lg font-bold text-white
          bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400
          hover:from-orange-300 hover:via-orange-400 hover:to-orange-500
          transition
        "
      >
        検索
      </button>

      <button
        onClick={onAdd} // ← ここも onAdd
        className="
          px-4 py-2 rounded-lg font-bold text-white
          bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400
          hover:from-orange-300 hover:via-orange-400 hover:to-orange-500
          transition
        "
      >
        ＋ 曲を追加
      </button>
    </div>
  );
}