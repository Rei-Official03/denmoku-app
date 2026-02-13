"use client";

import { useState } from "react";

type DiffCardProps = {
  id: string;
  patch: Record<string, unknown>;
  onCleared: () => void;
};

export default function DiffCard({ id, patch, onCleared }: DiffCardProps) {
  const [copied, setCopied] = useState(false);

  const copyPatch = () => {
  const lines = Object.entries(patch).map(
    ([key, value]) => `${key}: "${String(value)}",`
  );

  // ★ id を消して、純粋に patch のみコピー
  const text = lines.join("\n");

  navigator.clipboard.writeText(text);

  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};

  const clearThis = () => {
    const ok = confirm(
      "このIDの差分を削除しますか？\n（songData.ts に反映済みの場合のみ実行してください）"
    );
    if (!ok) return;

    const raw = localStorage.getItem("song_edits_v1");
    const obj = raw ? JSON.parse(raw) : {};
    delete obj[id];
    localStorage.setItem("song_edits_v1", JSON.stringify(obj));
    onCleared();
  };

  return (
    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-md text-white text-xs relative">

      {/* ★ コピーしました！ */}
     {copied && (
  <div className="absolute top-2 right-2 bg-white/80 text-black px-2 py-1 rounded-md text-[10px] shadow">
    コピーしました！
  </div>
)}

      <div className="flex justify-between items-center mb-2">
        <div className="font-bold">ID: {id}</div>
        <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-[10px]">
          編集未完了
        </span>
      </div>

      <pre className="whitespace-pre-wrap text-[11px] text-white/70 mb-3">
        {Object.entries(patch)
          .map(([k, v]) => `${k}: "${String(v)}"`)
          .join("\n")}
      </pre>

      <div className="flex gap-2">
        {/* ★ 水色グラデ */}
        <button
          onClick={copyPatch}
          className="
            px-3 py-1 rounded-lg font-bold text-white
            bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200
            hover:from-sky-500 hover:via-sky-400 hover:to-sky-300
            transition
          "
        >
          コードをコピー
        </button>

        <button
          onClick={clearThis}
          className="
            px-3 py-1 rounded-lg font-bold text-white
            bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200
            hover:from-sky-500 hover:via-sky-400 hover:to-sky-300
            transition
          "
        >
          編集完了
        </button>
      </div>
    </div>
  );
}