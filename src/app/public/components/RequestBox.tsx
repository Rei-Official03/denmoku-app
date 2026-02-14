"use client";

import { useState } from "react";

type RequestItem = {
  id: string;
  title: string;
  artist: string;
  from: string;
  createdAt: string;
  processed: boolean;
};

export default function RequestBox() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [from, setFrom] = useState("");
  const [toast, setToast] = useState(false);

  // -----------------------------
  // localStorage utilities
  // -----------------------------
  const loadRequests = (): RequestItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("requests_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveRequests = (list: RequestItem[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("requests_v1", JSON.stringify(list));
    } catch {
      // localStorage full などは握りつぶす
    }
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = () => {
    const newItem: RequestItem = {
      id: crypto.randomUUID(),
      title,
      artist,
      from,
      createdAt: new Date().toISOString(),
      processed: false,
    };

    const updated = [...loadRequests(), newItem];
    saveRequests(updated);

    setToast(true);
    setTimeout(() => setToast(false), 1500);

    setTitle("");
    setArtist("");
    setFrom("");
  };

  const disabled =
    !title.trim() || !artist.trim() || !from.trim();

  return (
    <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md text-white border border-white/10">
      <h2 className="text-sm font-bold mb-3">リクエスト曲を送る</h2>

      <div className="space-y-3 text-sm">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="曲名"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 text-white
            placeholder-white/50 focus:outline-none
            focus:ring-2 focus:ring-sky-300/50 transition
          "
        />

        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="アーティスト名"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 text-white
            placeholder-white/50 focus:outline-none
            focus:ring-2 focus:ring-sky-300/50 transition
          "
        />

        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="あなたのお名前（From）"
          className="
            w-full px-3 py-2 rounded-lg bg-white/20 text-white
            placeholder-white/50 focus:outline-none
            focus:ring-2 focus:ring-sky-300/50 transition
          "
        />

        <button
          disabled={disabled}
          onClick={handleSubmit}
          className={`
            w-full py-2 rounded-lg font-bold transition
            ${
              disabled
                ? "bg-sky-400/20 text-white/40 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200 hover:from-sky-500 hover:via-sky-400 hover:to-sky-300 text-white shadow-sm hover:shadow"
            }
          `}
        >
          送信する
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="
          fixed bottom-10 right-6 bg-white/20 backdrop-blur-md
          text-white text-xs px-4 py-2 rounded-full shadow-lg
          animate-toast
        ">
          ありがとう！受け付けたよ
        </div>
      )}

      <style>{`
        @keyframes toast {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-toast {
          animation: toast 1.4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}