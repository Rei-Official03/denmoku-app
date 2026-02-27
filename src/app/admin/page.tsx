"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import AdminSearchBar from "./components/AdminSearchBar";
import SongCardAdmin from "./components/SongCardAdmin";
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

export default function AdminPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    setSearchKeyword(keyword);
  };

  const mergedSongs = useMemo(() => {
    const diffs = loadDiffs();
    return mergeSongs(diffs);
  }, []);

  const sortedSongs = useMemo(() => {
    const q = searchKeyword.trim();
    if (!q) return [];

    const idMatch = mergedSongs.find((song) => song.id.toString() === q);
    if (idMatch) {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(`play_count_${idMatch.id}`)
          : null;
      const playCount = raw ? Number(raw) : 0;
      return [{ ...idMatch, playCount }];
    }

const filtered = searchSongs(mergedSongs, q, "all").map((song) => {
  const raw =
    typeof window !== "undefined"
      ? localStorage.getItem(`play_count_${song.id}`)
      : null;

  const playCount = raw ? Number(raw) : 0;
  return { ...song, playCount };
});

    return filtered.sort((a, b) => {
      if (b.playCount !== a.playCount) {
        return b.playCount - a.playCount;
      }
      return a.titleKana.localeCompare(b.titleKana);
    });
  }, [searchKeyword, mergedSongs]);

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
          onAdd={() => router.push("/admin/new")}
        />

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

        <RequestList />
        <DiffList />
      </main>
    </>
  );
}