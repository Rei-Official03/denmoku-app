"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { songs as initialSongs, type Song } from "@/lib/songData";

export default function EditSongPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [song, setSong] = useState<Song | null>(null);

  const [title, setTitle] = useState("");
  const [titleKana, setTitleKana] = useState("");
  const [artist, setArtist] = useState("");
  const [artistKana, setArtistKana] = useState("");
  const [scale, setScale] = useState("");
  const [genre, setGenre] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [toast, setToast] = useState(false);

  useEffect(() => {
    const base = initialSongs.find((s) => s.id === id) || null;
    setSong(base);
    if (base) {
      setTitle(base.title);
      setTitleKana(base.titleKana ?? "");
      setArtist(base.artist);
      setArtistKana(base.artistKana ?? "");
      setScale(base.scale);
      setGenre(base.genre);
      setSkillLevel(base.skillLevel ?? "");
      setIsPublic(base.isPublic ?? false);
    }
  }, [id]);

  const loadDiffs = () => {
    const raw = localStorage.getItem("song_edits_v1");
    return raw ? JSON.parse(raw) : {};
  };

  const saveDiffs = (obj: any) => {
    localStorage.setItem("song_edits_v1", JSON.stringify(obj));
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

    setToast(true);
    setTimeout(() => setToast(false), 1500);

    router.push("/admin");
  };

  if (!song) {
    return (
      <main className="mx-auto max-w-xl px-4 py-6 text-white">
        <div>曲が見つかりませんでした（ID: {id}）</div>
      </main>
    );
  }

  const disabled =
    !title.trim() ||
    !artist.trim() ||
    !titleKana.trim() ||
    !artistKana.trim() ||
    !scale.trim() ||
    !genre.trim() ||
    !skillLevel.trim();

  return (
    <main className="mx-auto max-w-xl px-4 py-6 text-white">
      <h1 className="text-lg font-bold mb-4">曲を編集（ID: {id}）</h1>

      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          className="w-full px-3 py-2 rounded-lg bg-white/20"
        />

        <input
          value={titleKana}
          onChange={(e) => setTitleKana(e.target.value)}
          placeholder="タイトル（読み仮名）"
          className="w-full px-3 py-2 rounded-lg bg-white/20"
        />

        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="アーティスト"
          className="w-full px-3 py-2 rounded-lg bg-white/20"
        />

        <input
          value={artistKana}
          onChange={(e) => setArtistKana(e.target.value)}
          placeholder="アーティスト（読み仮名）"
          className="w-full px-3 py-2 rounded-lg bg-white/20"
        />

        <input
          value={scale}
          onChange={(e) => setScale(e.target.value)}
          placeholder="スケール（例：A#m）"
          className="w-full px-3 py-2 rounded-lg bg-white/20"
        />

        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="ジャンル"
          className="w-full px-3 py-2 rounded-lg bg-white/20"
        />

        <input
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
          placeholder="skillLevel（◎ / ○ / △ / ×）"
          className="w-full px-3 py-2 rounded-lg bg-white/20"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          公開する
        </label>

        <button
          disabled={disabled}
          onClick={handleSave}
          className={`w-full py-2 rounded-lg transition ${
            disabled
              ? "bg-white/20 text-white/40"
              : "bg-white/30 hover:bg-white/40 text-white"
          }`}
        >
          保存する
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full shadow-lg animate-fade">
          保存したよ！
        </div>
      )}

      <style>{`
        @keyframes fade {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade {
          animation: fade 1.2s ease-in-out forwards;
        }
      `}</style>
    </main>
  );
}