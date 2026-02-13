"use client";

import { useMemo, useState, useEffect } from "react";
import { songs } from "@/lib/songData";
import {
  searchSongs,
  filterPublicSongs,
  getGenres,
  type SearchMode,
} from "@/lib/searchUtils";

import PublicSearchBar from "./components/PublicSearchBar";
import SongCardPublic from "./components/SongCardPublic";
import CosmicBackground from "./components/CosmicBackground";
import RequestBox from "./components/RequestBox";

const PAGE_SIZE = 10;

// 🔥 NEW バッジの表示条件（追加から30日以内）
const isNew = (createdAt: string) => {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diff = now - created;
  const days = diff / (1000 * 60 * 60 * 24);
  return days <= 30;
};

export default function PublicPage() {
  // createdAt を必ず "YYYY-MM-DD" の string に統一
  const songsWithDate = useMemo(() => {
    return songs.map((s) => {
      // 1) string で中身がある → そのまま
      if (typeof s.createdAt === "string" && s.createdAt.trim() !== "") {
        return { ...s, createdAt: s.createdAt };
      }

      // 2) Date 型 → string に変換
      if (s.createdAt instanceof Date) {
        return {
          ...s,
          createdAt: s.createdAt.toISOString().slice(0, 10),
        };
      }

      // 3) null / undefined / "" → 今日の日付
      return {
        ...s,
        createdAt: new Date().toISOString().slice(0, 10),
      };
    });
  }, []);

  // 曲データ
  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState<SearchMode>("all");
  const [genre, setGenre] = useState("");

  // 検索確定後の値
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("all");
  const [searchGenre, setSearchGenre] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  // ランキングと新着
  const [ranking, setRanking] = useState<any[]>([]);
  const [recentSongs, setRecentSongs] = useState<any[]>([]);

  // ジャンル一覧
  const genres = useMemo(() => getGenres(songsWithDate), [songsWithDate]);

  // 🔥 ランキング（localStorage はクライアント側のみ）
  useEffect(() => {
    const ranked = songsWithDate
      .map((song) => {
        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem(`play_count_${song.id}`)
            : null;

        const playCount = raw ? Number(raw) : 0;
        return { ...song, playCount };
      })
      .filter((s) => s.isPublic)
      .sort((a, b) => b.playCount - a.playCount);

    setRanking(ranked);
  }, [songsWithDate]);

  // 🔥 新着曲（createdAt 必須）
  useEffect(() => {
    const recent = songsWithDate
      .filter((s) => s.isPublic)
      .sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return db - da;
      })
      .slice(0, 10);

    setRecentSongs(recent);
  }, [songsWithDate]);

  // 検索ボタン押したときだけ検索が走る
  const handleSearch = () => {
    setSearchKeyword(keyword);
    setSearchMode(mode);
    setSearchGenre(genre);
    setHasSearched(true);
    setPage(1);
  };

  // フィルタリング
  const filteredSongs = useMemo(() => {
    if (!hasSearched) return [];

    let result = searchSongs(songsWithDate, searchKeyword);

    if (searchGenre) {
      result = result.filter((s) => s.genre === searchGenre);
    }

    result = filterPublicSongs(result);

    return result.sort((a, b) => a.titleKana.localeCompare(b.titleKana));
  }, [searchKeyword, searchGenre, hasSearched, songsWithDate]);

  const hasGoodSongs = filteredSongs.some(
    (s) => s.skillLevel === "◎" || s.skillLevel === "○"
  );

  const showRequestBox =
    hasSearched && (filteredSongs.length === 0 || !hasGoodSongs);

  const totalPages = useMemo(() => {
    if (!hasSearched) return 1;
    return Math.max(1, Math.ceil(filteredSongs.length / PAGE_SIZE));
  }, [filteredSongs.length, hasSearched]);

  const pagedSongs = useMemo(() => {
    if (!hasSearched) return [];
    const start = (page - 1) * PAGE_SIZE;
    return filteredSongs.slice(start, start + PAGE_SIZE);
  }, [filteredSongs, page, hasSearched]);

  const handleRandom = () => {
    const publicSongs = filterPublicSongs(songsWithDate);
    const shuffled = [...publicSongs].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    console.log("Random songs:", selected);
  };

  return (
    <main className="relative mx-auto w-full max-w-4xl px-4 py-6 text-white">
      <CosmicBackground />

      <h1 className="text-center text-xl font-bold mb-4 tracking-wide drop-shadow">
        Cosmic Lounge 🎧
      </h1>

      <PublicSearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        mode={mode}
        setMode={setMode}
        genre={genre}
        setGenre={setGenre}
        genres={genres}
        onSearch={handleSearch}
        onRandom={handleRandom}
      />

      <div className="text-white/60 text-[11px] mt-2 mb-3 text-center select-none">
        📌 スマホは長押し、PC は Ctrl + クリックでコピーできます
      </div>

      {/* PC＝横並び / スマホ＝縦並び */}
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* 左：検索結果 */}
        <div className="flex-1">
          {hasSearched && (
            <>
              <div className="text-white/80 text-xs mt-1 mb-2">
                {filteredSongs.length} 件ヒット
                {totalPages > 1 && (
                  <span className="ml-2 text-white/60">
                    （{page} / {totalPages} ページ）
                  </span>
                )}
              </div>

              {showRequestBox ? (
                <RequestBox />
              ) : (
                <>
                  <div className="space-y-3 mt-4">
                    {pagedSongs.map((song) => (
                      <SongCardPublic
                        key={song.id}
                        song={song}
                        onSelect={() => {}}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/80">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded-full border border-white/25 bg-white/10 hover:bg-white/18 disabled:opacity-40 transition"
                      >
                        ← 前へ
                      </button>
                      <span>{page} / {totalPages}</span>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded-full border border-white/25 bg-white/10 hover:bg-white/18 disabled:opacity-40 transition"
                      >
                        次へ →
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* 右（PC） / 下（スマホ）：ランキング＋新着 */}
        <div className="md:w-64 space-y-6">
          {/* 人気ランキング */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white/80">人気ランキング</h2>

            {ranking.slice(0, 10).map((song, i) => (
              <div
                key={song.id}
                className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/80"
              >
                {i + 1}位：{song.title}（{song.playCount} 回）
              </div>
            ))}
          </div>

          {/* 最近追加された曲（NEW バッジ付き） */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white/80">最近追加された曲</h2>

            {recentSongs.map((song) => (
              <div
                key={song.id}
                className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/80 flex items-center justify-between"
              >
                <span>{song.title}</span>

                {isNew(song.createdAt) && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-400/30 text-orange-100 font-bold tracking-wide flex items-center gap-1">
                    <span className="text-[11px]">★</span> NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}