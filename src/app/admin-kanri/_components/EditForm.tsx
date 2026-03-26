"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { loadDiffs, saveDiffs } from "@/lib/diffStorage";
import type { SongDiff } from "@/lib/types";

type Props = {
  id: number;
  initial: {
    title: string;
    titleKana: string;
    artist: string;
    artistKana: string;
    scale: string;
    genre: string;
    instUrl: string;
    skillLevel: string;
    isPublic: boolean;
  };
  titleLabel: string;
};

export default function EditForm({ id, initial, titleLabel }: Props) {
  const router = useRouter();

  // ★ 初期値を state に同期
  const [title, setTitle] = useState(initial.title);
  const [titleKana, setTitleKana] = useState(initial.titleKana);
  const [artist, setArtist] = useState(initial.artist);
  const [artistKana, setArtistKana] = useState(initial.artistKana);
  const [scale, setScale] = useState(initial.scale);
  const [genre, setGenre] = useState(initial.genre);
  const [instUrl, setInstUrl] = useState(initial.instUrl);
  const [skillLevel, setSkillLevel] = useState(initial.skillLevel);
  const [isPublic, setIsPublic] = useState(initial.isPublic);

  // ★ ID が変わったら初期値を再セット
  useEffect(() => {
    setTitle(initial.title);
    setTitleKana(initial.titleKana);
    setArtist(initial.artist);
    setArtistKana(initial.artistKana);
    setScale(initial.scale);
    setGenre(initial.genre);
    setInstUrl(initial.instUrl);
    setSkillLevel(initial.skillLevel);
    setIsPublic(initial.isPublic);
  }, [id, initial]);

  // ★ skillLevel の空白禁止
  const validSkill = skillLevel.trim() !== "";

  // ★ 保存ボタンの無効化条件
  const disabled =
    !title.trim() ||
    !artist.trim() ||
    !titleKana.trim() ||
    !artistKana.trim() ||
    !scale.trim() ||
    !genre.trim() ||
    !validSkill;

  // ★ 保存（diffStorage に直接保存）
  const handleSave = () => {
    const diffs = loadDiffs();

    const patch: SongDiff = {
      id,
      title: title.trim(),
      titleKana: titleKana.trim(),
      artist: artist.trim(),
      artistKana: artistKana.trim(),
      scale: scale.trim(),
      genre: genre.trim(),
      instUrl: instUrl.trim(),
      skillLevel: skillLevel.trim() as any,
      isPublic: Boolean(isPublic),
    };

    // 既存の diff を上書き or 新規追加
    const updated = [
      ...diffs.filter((d) => d.id !== id),
      patch,
    ];

    saveDiffs(updated);

    router.push("/admin-kanri");
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-6 text-white bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">

      {/* ← 戻る */}
      <button
        onClick={() => router.push("/admin-kanri")}
        className="text-white/70 hover:text-white text-sm mb-4"
      >
        ← 戻る
      </button>

      <h1 className="text-lg font-bold mb-6 tracking-wide drop-shadow">
        {titleLabel}（ID: {id}）
      </h1>

      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={titleKana}
          onChange={(e) => setTitleKana(e.target.value)}
          placeholder="タイトル（読み仮名）"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="アーティスト"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={artistKana}
          onChange={(e) => setArtistKana(e.target.value)}
          placeholder="アーティスト（読み仮名）"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={scale}
          onChange={(e) => setScale(e.target.value)}
          placeholder="スケール（例：A#m）"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="ジャンル"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        <input
          value={instUrl}
          onChange={(e) => setInstUrl(e.target.value)}
          placeholder="inst URL（任意）"
          className="w-full px-3 py-2 rounded-lg bg-white/20 placeholder-white/50"
        />

        {/* skillLevel */}
        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 text-white
            focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition
          "
        >
          <option value="" className="bg-[#1b2347]/80 text-sky-200">
            skillLevel を選択
          </option>
          <option value="◎" className="bg-[#1b2347]/80 text-sky-200">
            ◎（得意）
          </option>
          <option value="○" className="bg-[#1b2347]/80 text-sky-200">
            ○（まあまあ）
          </option>
          <option value="△" className="bg-[#1b2347]/80 text-sky-200">
            △（特訓）
          </option>
          <option value="×" className="bg-[#1b2347]/80 text-sky-200">
            ×（苦手）
          </option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="accent-sky-300"
          />
          公開する
        </label>

        <button
          disabled={disabled}
          onClick={handleSave}
          className={`
            w-full py-2 rounded-lg font-bold transition
            ${
              disabled
                ? "bg-sky-400/20 text-white/40 cursor-not-allowed"
                : `
                  bg-gradient-to-l from-sky-400 via-sky-300 to-sky-200
                  hover:from-sky-500 hover:via-sky-400 hover:to-sky-300
                  text-white shadow-sm hover:shadow
                `
            }
          `}
        >
          保存する
        </button>
      </div>
    </main>
  );
}