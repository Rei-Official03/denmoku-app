"use client";

import CosmicBackground from "./public/components/CosmicBackground";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-6 relative overflow-hidden text-white">
      {/* Cosmic Lounge 背景 */}
      <CosmicBackground />

      {/* Main Card */}
      <div
        className="
          w-full max-w-md rounded-3xl
          bg-white/20
          backdrop-blur-3xl
          border border-white/30
          shadow-xl shadow-black/20
          p-8 text-center space-y-6
        "
      >
        {/* Title */}
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-[#AEEBFF] to-[#F7B2C4] bg-clip-text text-transparent drop-shadow-lg tracking-wide">
          SongList ✦
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-white/80 font-medium">
          🌟 あたしの星空デンモク 🌟
        </p>

        {/* Description */}
        <p className="text-xs text-white/70 leading-relaxed">
          曲名・アーティストで今すぐ検索✨<br />
          ランダム機能もあるよ🎲
        </p>

        {/* Button */}
        <a
          href="/public"
          className="
            inline-flex items-center justify-center
            w-full rounded-full
            bg-gradient-to-r from-[#AEEBFF] via-[#F7B2C4] to-[#FF9A5C]
            px-6 py-3 text-[#0F1A3A] font-semibold
            shadow-lg shadow-black/30
            hover:scale-[1.04]
            active:scale-95
            transition
          "
        >
          🔍 曲を探してみる
        </a>

        {/* Footer */}
        <p className="text-[11px] text-white/60">
          created by midari ✧
        </p>
      </div>
    </main>
  );
}