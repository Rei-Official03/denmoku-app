"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import AdminSearchBar from "./components/AdminSearchBar";
import SongCardAdmin from "./components/SongCardAdmin";
import RequestList from "./components/RequestList";
import DiffList from "./components/DiffList";

import { songs as initialSongs, type Song } from "@/lib/songData";
import { searchSongs } from "@/lib/searchUtils";

export default function AdminPage() {
  const router = useRouter();

  // 入力中の検索ワード
  const [keyword, setKeyword] = useState("");

  // 検索確定後の値
  const [searchKeyword, setSearchKeyword] = useState("");

  // 検索実行
  const handleSearch = () => {
    setSearchKeyword(keyword);
  };

  // 曲データ（初期値のみ）
  const [songs] = useState<Song[]>(initialSongs);

  // 🔍 検索結果（ID検索 → あいまい検索 → 再生回数ソート）
  const sortedSongs = useMemo(() => {
    const q = searchKeyword.trim();
    if (!q) return [];

    // 1) ID 完全一致
    const idMatch = songs.find((song) => song.id.toString() === q);
    if (idMatch) {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(`play_count_${idMatch.id}`)
          : null;
      const playCount = raw ? Number(raw) : 0;
      return [{ ...idMatch, playCount }];
    }

    // 2) 通常検索 + 再生回数付与
    const filtered = searchSongs(songs, q).map((song) => {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(`play_count_${song.id}`)
          : null;
      const playCount = raw ? Number(raw) : 0;
      return { ...song, playCount };
    });

    // 3) 再生回数 → 50音順
    return filtered.sort((a, b) => {
      if (b.playCount !== a.playCount) {
        return b.playCount - a.playCount;
      }
      return a.titleKana.localeCompare(b.titleKana);
    });
  }, [searchKeyword, songs]);

  return (
    <main
      className="
        mx-auto max-w-xl px-4 py-6 text-white
        bg-white/5 backdrop-blur-md rounded-xl
        border border-white/10 shadow-lg
      "
    >
      {/* タイトル */}
      <h1 className="text-xl font-bold mb-6 tracking-wide drop-shadow">
        デンモク 管理画面
      </h1>

      {/* 検索バー */}
      <AdminSearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={handleSearch}
        onAdd={() => router.push("/admin/new")}
      />

      {/* 🔍 検索結果 */}
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

      {/* 📩 Requests */}
      <RequestList />

      {/* ⚠ Unmerged diffs */}
      <DiffList />
    </main>
  );
}