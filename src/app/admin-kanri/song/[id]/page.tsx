"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Song } from "@/lib/songData";

export default function SongDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [songs, setSongs] = useState<Song[]>([]);
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    import("@/lib/songData").then((mod) => {
      setSongs(mod.songs);
    });
  }, []);

  useEffect(() => {
    if (songs.length === 0) return;
    const s = songs.find((s) => s.id === id) || null;
    setSong(s);
  }, [songs, id]);

  const [isEditing, setIsEditing] = useState(false);

  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(`play_count_${id}`);
    setPlayCount(raw ? Number(raw) : 0);
  }, [id]);

  const handlePlay = () => {
    const newCount = playCount + 1;
    setPlayCount(newCount);

    if (typeof window !== "undefined") {
      localStorage.setItem(`play_count_${id}`, String(newCount));
    }
  };

  const [title, setTitle] = useState("");
  const [titleKana, setTitleKana] = useState("");
  const [artist, setArtist] = useState("");
  const [artistKana, setArtistKana] = useState("");
  const [scale, setScale] = useState("");
  const [genre, setGenre] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (!song) return;

    setTitle(song.title);
    setTitleKana(song.titleKana);
    setArtist(song.artist);
    setArtistKana(song.artistKana);
    setScale(song.scale);
    setGenre(song.genre);
    setSkillLevel(song.skillLevel);
    setIsPublic(song.isPublic);
  }, [song]);

  const loadDiffs = () => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("song_edits_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveDiffs = (obj: any) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("song_edits_v1", JSON.stringify(obj));
    } catch {}
  };

  const handleSave = () => {
    const diffs = loadDiffs();
    diffs[id] = {
      title,
      titleKana,
      artist,
      artistKana,
      scale,
      genre,
      skillLevel,
      isPublic,
    };
    saveDiffs(diffs);
    setIsEditing(false);
  };

  if (!song) {
    return (
      <main className="mx-auto max-w-xl px-4 py-6 text-white">
        曲が見つかりませんでした（ID: {id}）
      </main>
    );
  }

  const handleSing = () => {
    handlePlay();

    const url =
      typeof song.instUrl === "string" && song.instUrl.trim() !== ""
        ? song.instUrl
        : "https://www.youtube.com/";

    window.open(url, "_blank");
    navigator.clipboard.writeText(`${song.title} ${song.artist} カラオケ`);
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-6 text-white">
      {/* UI は元のまま */}
      …
    </main>
  );
}