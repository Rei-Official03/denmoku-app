"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import PublicSearchBar from "./components/PublicSearchBar";
import SongCardPublic from "./components/SongCardPublic";
import CosmicBackgroundPublic from "@/components/CosmicBackgroundPublic";
import RequestBox from "./components/RequestBox";

import { searchSongs } from "@/lib/searchUtils";
import { useMergedSongs } from "@/lib/useMergedSongs"; // ★追加

export default function PublicPage() {
  const router = useRouter();

  // ★ mergeSongs の代わりに常に最新の merged songs を取得
  const mergedSongs = useMergedSongs();

  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState("all");
  const [genre, setGenre] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchMode, setSearchMode] = useState("all");
  const [searchGenre, setSearchGenre] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  const [randomResults, setRandomResults] = useState(null);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // クリア
  const handleClearResults = () => {
    setKeyword("");
    setMode("all");
    setGenre("");

    setSearchKeyword("");
    setSearchMode("all");
    setSearchGenre("");

    setHasSearched(false);
    setRandomResults(null);
    setPage(1);
  };

  // ジャンル一覧
  const genres = useMemo(() => {
    const set = new Set();
    mergedSongs.forEach((s) => set.add(s.genre));
    return Array.from(set);
  }, [mergedSongs]);

  // 人気ランキング
  const [ranking, setRanking] = useState([]);
  useEffect(() => {
    const ranked = mergedSongs
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
  }, [mergedSongs]);

  // 最近追加
  const [recentSongs, setRecentSongs] = useState([]);
  const [showAllRecent, setShowAllRecent] = useState(false);
  useEffect(() => {
    const sorted = [...mergedSongs]
      .filter((s) => s.isPublic)
      .sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return db - da;
      });

    setRecentSongs(sorted);
  }, [mergedSongs]);

  // ⭐ 検索実行
  const handleSearch = () => {
    setSearchKeyword(keyword.trim());
    setSearchMode(mode);
    setSearchGenre(genre);

    setHasSearched(true);
    setRandomResults(null);
    setPage(1);
  };

  // ランダム
  const handleRandom = () => {
    let pool = mergedSongs.filter((s) => s.isPublic);

    if (genre) {
      pool = pool.filter((s) => s.genre === genre);
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    setSearchKeyword("");
    setSearchMode("all");
    setSearchGenre(genre);

    setRandomResults(selected);
    setHasSearched(false);
    setPage(1);
  };

  // ⭐ 検索結果
  const filteredSongs = useMemo(() => {
    const q = searchKeyword.trim();

    if (q === "" && searchGenre === "") return [];

    const result = searchSongs(mergedSongs, q, searchMode);

    const genreFiltered =
      searchGenre === "" ? result : result.filter((s) => s.genre === searchGenre);

    return genreFiltered.filter((s) => s.isPublic);
  }, [searchKeyword, searchMode, searchGenre, mergedSongs]);

  // ページング
  const pageSize = 10;
  const totalPages = Math.ceil(filteredSongs.length / pageSize);
  const pagedSongs = filteredSongs.slice((page - 1) * pageSize, page * pageSize);

  if (!hydrated) return null;

  return (
    <>
      <CosmicBackgroundPublic />

      <main className="mx-auto max-w-xl px-4 py-6 text-white bg-transparent">
        <div className="sticky top-0 z-20 pb-4 bg-transparent">
          <h1
            className="
              text-4xl font-extrabold
              bg-gradient-to-r from-white via-[#7C8CFF] to-[#0F1A3A]
              bg-clip-text text-transparent
              drop-shadow-xl tracking-wide
              mb-6
            "
          >
            <center>SongList ✦</center>
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
            onClearResults={handleClearResults}
          />

          {!hasSearched && !randomResults && (
            <div
              className="
                mt-10 p-4 rounded-xl
                bg-white/10 text-white
                backdrop-blur-sm
                border border-white/20
                shadow-lg shadow-black/30
                text-center text-md
                font-bold
              "
            >
              検索するとここに結果が表示されます
            </div>
          )}

          <div className="mt-4 text-lg text-white font-bold text-center drop-shadow-[0_0_6px_#0F1A3A]">
            📌 リクエスト曲はカードをダブルタップでコピーできます
          </div>
        </div>

        {/* 人気ランキング */}
        {!hasSearched && !randomResults && (
          <div
            className="
              mt-10 p-4 rounded-xl
              bg-white/10 text-white
              backdrop-blur-sm
            "
          >
            <h2 className="text-2xl font-bold mb-4 tracking-wide">
              <center>🏆人気ランキング🏆</center>
            </h2>

            <div className="space-y-4">
              {ranking.slice(0, 5).map((song, index) => (
                <div key={song.id}>
                  <div className="font-bold">
                    {index + 1}位 {song.title} / {song.artist}
                  </div>

                  <div className="flex justify-between text-base text-white/90 mt-1">
                    <span>♪ {song.genre}</span>
                    <span>{song.playCount} 回</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 最近追加 */}
        {!hasSearched && !randomResults && (
          <div className="mt-10">
            <h2 className="text-lg font-bold mb-3">最近追加された曲</h2>

            <div className="space-y-3">
              {(showAllRecent ? recentSongs : recentSongs.slice(0, 5)).map(
                (song) => (
                  <SongCardPublic key={song.id} song={song} />
                )
              )}
            </div>

            {recentSongs.length > 5 && (
              <button
                onClick={() => setShowAllRecent(!showAllRecent)}
                className="text-white/80 text-sm mt-3 underline"
              >
                {showAllRecent ? "close" : "…and more"}
              </button>
            )}
          </div>
        )}

        {/* ランダム */}
        {randomResults && (
          <div className="mt-8 space-y-3">
            {randomResults.map((song) => (
              <SongCardPublic key={song.id} song={song} />
            ))}
          </div>
        )}

        {/* 検索結果 */}
        {hasSearched && (
          <div className="mt-8">
            <div className="text-white/70 text-sm mb-3">
              検索結果：{filteredSongs.length} 件
            </div>

            {/* 🔥 0 件 → RequestBox */}
            {filteredSongs.length === 0 && !randomResults && (
              <div className="mt-10">
                <RequestBox />
              </div>
            )}

            <div className="space-y-3">
              {pagedSongs.map((song) => (
                <SongCardPublic key={song.id} song={song} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-6 text-sm">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 bg-white/10 rounded disabled:opacity-30"
                >
                  前へ
                </button>
                <div className="text-white/70">
                  {page} / {totalPages}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 bg-white/10 rounded disabled:opacity-30"
                >
                  次へ
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}