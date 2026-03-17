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
  const [mode, setMode] = useState("name"); // ID / 名前
  const [searchKeyword, setSearchKeyword] = useState("");

  const [randomResults, setRandomResults] = useState(null);

  // SSR → CSR 切り替え
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // 🔍 検索ボタン
  const handleSearch = () => {
    setSearchKeyword(keyword); // ← 検索ボタンを押した時だけ検索状態にする
    setRandomResults(null);
  };

  // 🎲 ランダムボタン
  const handleRandom = () => {
    const results = pickRandomAdminSongs(mergedSongs);
    setRandomResults(results);
    setSearchKeyword(""); // ← 検索結果を消す
  };

  // ⭐ ラジオボタン切り替え時に検索状態をリセット（今回の本命）
  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    setSearchKeyword("");   // ← 検索結果を消す
    setRandomResults(null); // ← ランダムも消す
  };

  // mergeSongs（diff + 新規曲 + playCount）
  const mergedSongs = useMemo(() => {
    const diffs = loadDiffs();
    return mergeSongs(diffs);
  }, []);

  // 🔍 検索結果
  const sortedSongs = useMemo(() => {
    const q = searchKeyword.trim();
    if (q === "") return []; // ← 空なら検索しない

    // ID検索
    if (mode === "id") {
      const idMatch = mergedSongs.find((song) => song.id.toString() === q);
      return idMatch ? [idMatch] : [];
    }

    // 名前検索（曲名＋アーティスト名まとめて）
    const filtered = searchSongs(mergedSongs, q, "all");

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

        {/* 検索結果（検索ボタンを押した時だけ表示） */}
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