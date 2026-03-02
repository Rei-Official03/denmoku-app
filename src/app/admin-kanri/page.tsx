"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import AdminSearchBar from "./components/AdminSearchBar";
import SongCardAdmin from "@/app/admin-kanri/components/SongCardAdmin";
import RequestList from "./components/RequestList";
import DiffList from "./components/DiffList";
import CosmicBackgroundAdmin from "@/components/CosmicBackgroundAdmin";

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

// ◎ から 5 曲ランダム（管理側）
const pickRandomAdminSongs = (songs) => {
  const good = songs.filter((s) => s.skillLevel === "◎");
  const shuffled = [...good].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
};

export default function AdminPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [randomResults, setRandomResults] = useState(null);

  // SSR → CSR 切り替え
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setRandomResults(null); // ← ランダム結果を消す
  };

  const handleRandom = () => {
    const results = pickRandomAdminSongs(mergedSongs);
    setRandomResults(results);
    setSearchKeyword(""); // ← 検索結果を消す
  };

  // ★ mergeSongs の結果を一覧に使う（playCount も統合済み）
  const mergedSongs = useMemo(() => {
    const diffs = loadDiffs();
    return mergeSongs(diffs);
  }, []);

  // ★ 検索結果
  const sortedSongs = useMemo(() => {
    const q = searchKeyword.trim();
    if (!q) return [];

    // ID 完全一致
    const idMatch = mergedSongs.find((song) => song.id.toString() === q);
    if (idMatch) {
      return [idMatch];
    }

    // 通常検索
    const filtered = searchSongs(mergedSongs, q, "all");

    // playCount → titleKana の順でソート
    return filtered.sort((a, b) => {
      if (b.playCount !== a.playCount) {
        return b.playCount - a.playCount;
      }
      return a.titleKana.localeCompare(b.titleKana);
    });
  }, [searchKeyword, mergedSongs]);

  if (!hydrated) return null;

  return (
    <>
      <CosmicBackgroundAdmin />

      <main
        className="
          mx-auto max-w-xl px-4 py-6 text-white
          bg-white/5 backdrop-blur-md rounded-xl
          border border-white/10 shadow-lg
        "
      >
        <h1 className="text-xl font-bold mb-6 tracking-wide drop-shadow">
          デンモク 管理画面
        </h1>

        <AdminSearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          onSearch={handleSearch}
          onAdd={() => router.push("/admin-kanri/new")}
        />

        {/* ランダムボタン */}
        <button
          onClick={handleRandom}
          className="
            mt-3 mb-6 px-4 py-2 rounded-lg
            bg-white/10 hover:bg-white/20
            text-sm font-bold transition
          "
        >
          ランダム（◎ × 5）
        </button>

        {/* ランダム結果 */}
        {randomResults && (
          <div className="mb-10">
            <div className="text-white/70 text-sm mb-3">
              ランダム選曲（◎ × 5）
            </div>

            <div className="space-y-3">
              {randomResults.map((song) => (
                <SongCardAdmin key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}

        {/* 検索結果 */}
        {searchKeyword && (
          <div className="mb-10">
            <div className="text-white/70 text-sm mb-3">
              検索結果：{sortedSongs.length} 件
            </div>

            <div className="space-y-3">
              {sortedSongs.map((song) => (
                <SongCardAdmin key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}

        {/* リクエスト一覧 */}
        <RequestList />

        {/* Diff 一覧 */}
        <DiffList />
      </main>
    </>
  );
}