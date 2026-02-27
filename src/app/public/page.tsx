"use client";

import { Toaster, toast } from "react-hot-toast";
import { useMemo, useState, useEffect } from "react";
import { mergeSongs } from "@/lib/mergeSongs";
import { songs } from "@/lib/songData";
import {
  searchSongs,
  filterPublicSongs,
  getGenres,
  type SearchMode,
} from "@/lib/searchUtils";

import PublicSearchBar from "./components/PublicSearchBar";
import SongCardPublic from "./components/SongCardPublic";
import CosmicBackgroundPublic from "@/components/CosmicBackgroundPublic";
import RequestBox from "./components/RequestBox";

const PAGE_SIZE = 10;

// localStorage 読み込み
const loadDiffs = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("song_edits_v1");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export default function PublicPage() {
  // diff を読み込んで合成（createdAt 正規化 & isNew 付与済み）
  const mergedSongs = useMemo(() => {
    const diffs = loadDiffs();
    return mergeSongs(diffs);
  }, []);

  // UI 状態
  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState<SearchMode>("all");
  const [genre, setGenre] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("all");
  const [searchGenre, setSearchGenre] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  const [ranking, setRanking] = useState<any[]>([]);
  const [recentSongs, setRecentSongs] = useState<any[]>([]);

  const [randomResults, setRandomResults] = useState<any[] | null>(null);
  const [recentExpanded, setRecentExpanded] = useState(false);

  const genres = useMemo(() => getGenres(mergedSongs), [mergedSongs]);

  // 🏆 人気ランキング
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
  useEffect(() => {
    const recent = mergedSongs
      .filter((s) => s.isPublic)
      .sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return db - da;
      })
      .slice(0, 50);

    setRecentSongs(recent);
  }, [mergedSongs]);

  // 検索
  const handleSearch = () => {
    setSearchKeyword(keyword);
    setSearchMode(mode);
    setSearchGenre(genre);
    setHasSearched(true);
    setPage(1);
  };

  const handleClearResults = () => {
    setKeyword("");
    setGenre("");
    setMode("all");
    setHasSearched(false);
    setRandomResults(null);
  };

  // ランダム
  const handleRandom = () => {
    if (mode !== "all") {
      toast("「すべて」を選択してから押してね", {
        style: {
          background: "rgba(20, 32, 74, 0.6)",
          backdropFilter: "blur(8px)",
          color: "#F7FAFF",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "12px",
        },
      });
      return;
    }

    let pool = mergedSongs.filter((s) => s.isPublic);
    const allowedLevels = ["△", "○", "◎"];
    pool = pool.filter((s) => allowedLevels.includes(s.skillLevel));

    if (genre) {
      pool = pool.filter((s) => s.genre === genre);
    }

    if (pool.length === 0) {
      toast("条件に合う曲が見つからなかったよ…", {
        style: {
          background: "rgba(20, 32, 74, 0.6)",
          backdropFilter: "blur(8px)",
          color: "#F7FAFF",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "12px",
        },
      });
      return;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    setRandomResults(selected);
    setHasSearched(true);
    setPage(1);
  };

  // 検索結果
  const filteredSongs = useMemo(() => {
    if (!hasSearched) return [];

    let result = searchSongs(mergedSongs, searchKeyword, searchMode);

    if (searchGenre) {
      result = result.filter((s) => s.genre === searchGenre);
    }

    result = filterPublicSongs(result);

    return result.sort((a, b) => a.titleKana.localeCompare(b.titleKana));
  }, [searchKeyword, searchGenre, searchMode, hasSearched, mergedSongs]);

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

  const finalSongs = randomResults ?? pagedSongs;

  return (
    <>
      <Toaster position="top-center" />

      <main className="relative mx-auto w-full max-w-4xl px-4 py-6 text-black">
        <CosmicBackgroundPublic />

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
          onSearch={() => {
            setRandomResults(null);
            handleSearch();
          }}
          onRandom={() => {
            setRandomResults(null);
            handleRandom();
          }}
          onClearResults={handleClearResults}
        />

        <div className="text-white/100 text-[12px] mt-2 mb-3 text-center select-none">
          📌検索結果 : スマホは長押し、PC は Ctrl + クリックでコピーできます
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* 左：検索結果 */}
          <div className="flex-1">
            {hasSearched && (
              <>
                <div className="text-white/80 text-xs mt-1 mb-2">
                  {randomResults
                    ? randomResults.length
                    : filteredSongs.length}{" "}
                  件ヒット
                  {randomResults === null && totalPages > 1 && (
                    <span className="ml-2 text-white/90">
                      （{page} / {totalPages} ページ）
                    </span>
                  )}
                </div>

                {/* grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {finalSongs.map((song) => (
                    <SongCardPublic
                      key={song.id}
                      song={song}
                      onSelect={() => {}}
                      isNew={song.isNew}
                    />
                  ))}
                </div>

                {showRequestBox ? (
                  <RequestBox />
                ) : (
                  <>
                    {randomResults === null && totalPages > 1 && (
                      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="
                            px-3 py-1 rounded-full
                            border border-white/60
                            bg-gradient-to-r from-white/30 to-white/15
                            shadow-md shadow-black/30
                            text-white
                            hover:from-white/40 hover:to-white/25
                            disabled:opacity-40
                            transition
                          "
                        >
                          ← 前へ
                        </button>

                        <span className="text-white">
                          {page} / {totalPages}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={page === totalPages}
                          className="
                            px-3 py-1 rounded-full
                            border border-white/60
                            bg-gradient-to-r from-white/30 to-white/15
                            shadow-md shadow-black/30
                            text-white
                            hover:from-white/40 hover:to-white/25
                            disabled:opacity-40
                            transition
                          "
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

          {/* 右：ランキング + 最近追加 */}
          <div className="md:w-64 space-y-6">
            {/* 人気ランキング */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white/80">人気ランキング</h2>

              {ranking.slice(0, 5).map((song, i) => (
                <div
                  key={song.id}
                  className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/80"
                >
                  {i + 1}位：{song.title}（{song.playCount} 回）
                </div>
              ))}
            </div>

            {/* 最近追加 */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white/80">
                最近追加された曲
              </h2>

              {(recentExpanded ? recentSongs : recentSongs.slice(0, 5)).map(
                (song) => (
                  <div
                    key={song.id}
                    className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/80"
                  >
                    {song.title}
                  </div>
                )
              )}

              {!recentExpanded && recentSongs.length > 5 && (
                <button
                  type="button"
                  onClick={() => setRecentExpanded(true)}
                  className="w-full text-right text-white/40 text-[11px] pr-1 select-none hover:text-white/60 transition"
                >
                  and more…
                </button>
              )}

              {recentExpanded && (
                <button
                  type="button"
                  onClick={() => setRecentExpanded(false)}
                  className="w-full text-right text-white/40 text-[11px] pr-1 mt-1 select-none hover:text-white/60 transition"
                >
                  close
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}