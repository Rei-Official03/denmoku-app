"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import PublicSearchBar from "./components/PublicSearchBar";
import SongCardPublic from "./components/SongCardPublic";
import CosmicBackgroundPublic from "@/components/CosmicBackgroundPublic";

import { searchSongs } from "@/lib/searchUtils";
import { mergeSongs } from "@/lib/mergeSongs";

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

// 公開側ランダム（◎ / ○ / △）
const pickRandomPublicSongs = (songs) => {
  const publicSongs = songs.filter((s) => s.isPublic);

  const good = publicSongs.filter((s) => s.skillLevel === "◎");
  const ok = publicSongs.filter((s) => s.skillLevel === "○");
  const weak = publicSongs.filter((s) => s.skillLevel === "△");

  const pick = (arr) =>
    arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

  let a = pick(good);
  let b = pick(ok);
  let c = pick(weak);

  if (!a) a = pick(ok) || pick(weak);
  if (!b) b = pick(good) || pick(weak);
  if (!c) c = pick(good) || pick(ok);

  return [a, b, c].filter(Boolean);
};

export default function PublicPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState("all");
  const [genre, setGenre] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchMode, setSearchMode] = useState("all");
  const [searchGenre, setSearchGenre] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  const [randomResults, setRandomResults] = useState(null);

  // SSR → CSR 切り替え
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // mergeSongs（diff + 新規曲 + playCount）
  const mergedSongs = useMemo(() => {
    const diffs = loadDiffs();
    return mergeSongs(diffs);
  }, []);

  // クリア
  const handleClearResults = () => {
    setKeyword("");
    setMode("all");
    setGenre("");

    // 検索状態もリセット
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

  // ⭐ 人気ランキング（playCount順）
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

  // 🆕 最近追加された曲（createdAt の新しい順）
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

  // 検索実行
  const handleSearch = () => {
    setSearchKeyword(keyword);
    setSearchMode(mode);
    setSearchGenre(genre);
    setHasSearched(true);
    setPage(1);
    setRandomResults(null);
  };

  // ランダム実行（ジャンル対応＋最後のやつも反映）
  const handleRandom = () => {
    // 公開曲だけ
    let pool = mergedSongs.filter((s) => s.isPublic);

    // ジャンル指定があれば絞る
    if (genre) {
      pool = pool.filter((s) => s.genre === genre);
    }

    // シャッフル
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // 3曲だけ選ぶ
    const selected = shuffled.slice(0, 3);

    // 検索状態もランダム用に更新
    setSearchKeyword("");
    setSearchMode("all");
    setSearchGenre(genre);

    setRandomResults(selected);
    setHasSearched(false);
    setPage(1);
  };

  // 検索結果
  const filteredSongs = useMemo(() => {
    if (!hasSearched) return [];

    const q = searchKeyword.trim();
    const result = searchSongs(mergedSongs, q, searchMode);

    const genreFiltered =
      searchGenre === "" ? result : result.filter((s) => s.genre === searchGenre);

    return genreFiltered.filter((s) => s.isPublic);
  }, [hasSearched, searchKeyword, searchMode, searchGenre, mergedSongs]);

  // ページング
  const pageSize = 10;
  const totalPages = Math.ceil(filteredSongs.length / pageSize);
  const pagedSongs = filteredSongs.slice((page - 1) * pageSize, page * pageSize);

  if (!hydrated) return null;

  return (
    <>
      <CosmicBackgroundPublic />

      <main
        className="
          mx-auto max-w-xl px-4 py-6 text-white
          bg-transparent
        "
      >
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

          {/* 🔍 検索前の説明エリア */}
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

          {/* ダブルタップ説明 */}
          <div className="mt-4 text-lg text-white font-bold text-center drop-shadow-[0_0_6px_#0F1A3A]">
            📌 リクエスト曲はカードをダブルタップでコピーできます
          </div>
        </div>

        {/* ⭐ 人気ランキング（1枚のカード） */}
        {!hasSearched && !randomResults && (
          <div
            className="
              mt-10 p-4 rounded-xl
              bg-white/10 text-white
              backdrop-blur-sm
            "
          >
            <h2 className="text-2xl font-bold mb-4 tracking-wide">
              <center>🏆人気ランキング🏆　　</center>
            </h2>

            <div className="space-y-4">
              {ranking.slice(0, 5).map((song, index) => (
                <div key={song.id}>
                  {/* ○位 + 曲名 / アーティスト名 */}
                  <div className="font-bold">
                    {index + 1}位 {song.title} / {song.artist}
                  </div>

                  {/* ♪ジャンル　　○回 */}
                  <div className="flex justify-between text-base text-white/90 mt-1">
                    <span>♪ {song.genre}</span>
                    <span>{song.playCount} 回</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🆕 最近追加された曲（5件＋and more） */}
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

        {/* 🎲 ランダム */}
        {randomResults && (
          <div className="mt-8 space-y-3">
            {randomResults.map((song) => (
              <SongCardPublic key={song.id} song={song} />
            ))}
          </div>
        )}

        {/* 🔍 検索結果 */}
        {hasSearched && (
          <div className="mt-8">
            <div className="text-white/70 text-sm mb-3">
              検索結果：{filteredSongs.length} 件
            </div>

            <div className="space-y-3">
              {pagedSongs.map((song) => (
                <SongCardPublic key={song.id} song={song} />
              ))}
            </div>

            {/* ページング */}
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