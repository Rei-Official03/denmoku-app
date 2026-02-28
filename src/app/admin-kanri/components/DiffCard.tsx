"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DiffCardProps = {
  id: number;                     // ← localStorage のキー（削除・編集用）
  patch: Record<string, unknown>;
  onCleared: () => void;
};

export default function DiffCard({ id, patch, onCleared }: DiffCardProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // -----------------------------------
  // コードコピー
  // -----------------------------------
  const copyPatch = () => {
    const lines = Object.entries(patch).map(([key, value]) => {
    if (typeof value === "boolean") {
      return `${key}: ${value},`; // ← boolean はそのまま
    }
    if (typeof value === "number") {
      return `${key}: ${value},`; // ← number もそのまま
    }
    return `${key}: "${String(value)}",`; // ← string は "" で囲む
  });


    // 今日の日付 YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // createdAt を最後に追加
    const text =
      `id: ${id},\n` +        // ← ★ diff の ID を使う
      lines.join("\n") +
      `\ncreatedAt: "${today}",`;

    navigator.clipboard.writeText(text);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // -----------------------------------
  // 編集する（差分編集画面へ）
  // -----------------------------------
  const goEdit = () => {
    router.push(`/admin-kanri/diff-edit/${id}`);
  };

  // -----------------------------------
  // この差分だけ削除
  // -----------------------------------
  const clearThis = () => {
    const ok = confirm(
      "このIDの差分を削除しますか？\n（songData.ts に反映済みの場合のみ実行してください）"
    );
    if (!ok) return;

    try {
      const raw = localStorage.getItem("song_edits_v1");
      const obj = raw ? JSON.parse(raw) : {};
      delete obj[id]; // ← localStorage のキーを削除
      localStorage.setItem("song_edits_v1", JSON.stringify(obj));
    } catch {}

    onCleared();
  };

  return (
    <div
      className="
        p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-md text-white text-xs
        border border-white/10 relative
      "
    >
      {/* コピーしました！ */}
      {copied && (
        <div
          className="
            absolute top-2 right-2 bg-white/80 text-black
            px-2 py-1 rounded-md text-[10px] shadow animate-toast
          "
        >
          コピーしました！
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        {/* 表示用 ID（diff の ID） */}
        <div className="font-bold">ID: {id}</div>

        <span
          className="
            px-2 py-0.5 rounded-full bg-yellow-400/20
            text-[10px] text-yellow-200 font-bold
          "
        >
          編集未完了
        </span>
      </div>

      {/* 差分内容 */}
      <pre className="whitespace-pre-wrap text-[11px] text-white/70 mb-3">
  {Object.entries(patch)
    .filter(([k]) => k !== "id")
    .map(([k, v]) => `${k}: "${String(v)}"`)
    .join("\n")}
</pre>

      <div className="flex gap-2">
        {/* コードコピー */}
        <button
          onClick={copyPatch}
          className="
            px-3 py-1 rounded-lg font-bold text-white
            bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200
            hover:from-sky-500 hover:via-sky-400 hover:to-sky-300
            shadow-sm hover:shadow transition
          "
        >
          コードをコピー
        </button>

        {/* 編集する */}
        <button
          onClick={goEdit}
          className="
            px-3 py-1 rounded-lg font-bold text-white
            bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500
            hover:from-sky-400 hover:via-sky-500 hover:to-sky-600
            shadow-sm hover:shadow transition
          "
        >
          編集する
        </button>

        {/* 編集完了（差分削除） */}
        <button
          onClick={clearThis}
          className="
            px-3 py-1 rounded-lg font-bold text-white
            bg-gradient-to-r from-green-300 via-green-400 to-green-500
            hover:from-green-400 hover:via-green-500 hover:to-green-600
            shadow-sm hover:shadow transition
          "
        >
          編集完了
        </button>
      </div>

      <style>{`
        @keyframes toast {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-toast {
          animation: toast 1.2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}