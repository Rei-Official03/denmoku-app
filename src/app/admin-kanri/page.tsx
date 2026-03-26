"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import AdminSearchBar from "./components/AdminSearchBar";
import SongCardAdmin from "@/app/admin-kanri/components/SongCardAdmin";
import RequestList from "./components/RequestList";
import DiffList from "./components/DiffList";
import CosmicBackgroundAdmin from "@/components/CosmicBackgroundAdmin";

import type { SongWithMeta } from "@/lib/types";
import { searchAdminByName, searchAdminById } from "@/lib/searchUtils"; // ★後で修正する
import { useMergedSongs } from "@/lib/useMergedSongs"; // ★追加

// ◎ から 5 曲ランダム（管理側）
const pickRandomAdminSongs = (songs: SongWithMeta[]): SongWithMeta[] => {
  const good = songs.filter((s) => s.skillLevel === "◎");
  const shuffled = [...good].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
};

export default function AdminPage() {
  const router = useRouter();

  // ★ mergeSongs の代わりに常に最新の merged songs を取得
  const mergedSongs = useMergedSongs();

  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState<"id" | "name">("name");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [randomResults, setRandomResults] = useState<SongWithMeta[] | null>(null);

  // SSR → CSR 切り替え
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // 🔍 検索ボタン
  const handleSearch = () => {
    setSearchKeyword(keyword.trim());
    setRandomResults(null);
  };

  // 🎲 ランダムボタン
  const handleRandom = () => {
    const results = pickRandomAdminSongs(mergedSongs);
    setRandomResults(results);
    setSearchKeyword("");
  };

  // ⭐ ラジオボタン切り替え時に検索状態をリセット
  const handleModeChange = (newMode: "id" | "name") => {
    setMode(newMode);
    setSearchKeyword("");
    setRandomResults(null);
  };

  // 🔍 検索結果
  const sortedSongs = useMemo(() => {
    const q = searchKeyword.trim();
    if (q === "") return [];

    if (mode === "id") {
      return searchAdminById(mergedSongs, q);
    }

    // ★ 名前検索は searchAdminByName に統一（後で searchUtils を修正）
    const filtered = searchAdminByName(mergedSongs, q);

    return filtered.sort((a, b) => {
      if (b.playCount !== a.playCount) return b.playCount - a.playCount;
      return a.titleKana.localeCompare(b.titleKana);
    });
  }, [searchKeyword, mergedSongs, mode]);

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
          mode={mode}
          setMode={handleModeChange}
          onSearch={handleSearch}
          onAdd={() => router.push("/admin-kanri/new")}
          onRandom={handleRandom}
          onClear={() => {
            setKeyword("");
            setSearchKeyword("");
            setRandomResults(null);
          }}
        />

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
        {searchKeyword !== "" && (
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

        <RequestList />
        <DiffList />
      </main>
    </>
  );
}