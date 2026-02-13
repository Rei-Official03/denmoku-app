"use client";

import { useState } from "react";

export default function RequestBox() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [from, setFrom] = useState("");
  const [toast, setToast] = useState(false);

  const loadRequests = () => {
    const raw = localStorage.getItem("requests_v1");
    return raw ? JSON.parse(raw) : [];
  };

  const saveRequests = (list: any[]) => {
    localStorage.setItem("requests_v1", JSON.stringify(list));
  };

  const handleSubmit = () => {
    const newItem = {
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

  const disabled = !title.trim() || !artist.trim() || !from.trim();

  return (
    <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md text-white">
      <h2 className="text-sm font-bold mb-3">リクエスト曲を送る</h2>

      <div className="space-y-3 text-sm">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="曲名"
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/50"
        />
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="アーティスト名"
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/50"
        />
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="あなたのお名前（From）"
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/50"
        />

        <button
  disabled={disabled}
  onClick={handleSubmit}
  className={`
    w-full py-2 rounded-lg font-bold transition
    ${disabled
      ? "bg-blue-500/20 text-white/40"
      : "bg-blue-500 hover:bg-blue-600 text-white"
    }
  `}
>
  送信する
</button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full shadow-lg animate-fade">
          ありがとう！受け付けたよ
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
    </div>
  );
}