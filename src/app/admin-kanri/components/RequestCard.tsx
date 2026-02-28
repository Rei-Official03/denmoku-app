"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RequestItem } from "@/lib/requestStorage";

type Props = {
  item: RequestItem;
  onChange: () => void;
};

export default function RequestCard({ item, onChange }: Props) {
  const router = useRouter();
  const [data, setData] = useState<RequestItem | null>(item);

  // -----------------------------
  // localStorage utilities
  // -----------------------------
  const load = (): RequestItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("requests_v1");
      return raw ? (JSON.parse(raw) as RequestItem[]) : [];
    } catch {
      return [];
    }
  };

  const save = (list: RequestItem[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("requests_v1", JSON.stringify(list));
    } catch {
      // localStorage full などは握りつぶす
    }
  };

  // -----------------------------
  // Mark as processed
  // -----------------------------
  const markProcessed = () => {
    if (!data) return;

    const list = load();
    const updated = list.map((r) =>
      r.id === data.id ? { ...r, processed: true } : r
    );

    save(updated);
    setData({ ...data, processed: true });
    onChange();
  };

  // -----------------------------
  // Delete item
  // -----------------------------
  const deleteItem = () => {
    if (!data) return;
    if (!confirm("新しく登録しますか？")) return;

    const updated = load().filter((r) => r.id !== data.id);
    save(updated);

    // UI から即座に消す
    setData(null);
    onChange();
  };

  if (!data) return null;

  return (
    <div
      className={`
        p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-md text-white
        border border-white/10 transition
        ${data.processed ? "opacity-50" : ""}
      `}
    >
      <div className="text-sm font-bold">{data.title}</div>
      <div className="text-xs text-white/70">{data.artist}</div>
      <div className="text-xs text-white/50 mt-1">From: {data.from}</div>
      <div className="text-[10px] text-white/40 mt-1">
        {new Date(data.createdAt).toLocaleString()}
      </div>

      <div className="flex gap-2 mt-3 text-xs">
        {/* Learned ボタン */}
        <button
  onClick={() => {
    // ① 処理済みにする（diff 作成のトリガー）
    markProcessed();

    // ② リクエスト曲を即削除
    deleteItem(); // ← これを追加！

    // ③ 新規曲追加ページへ遷移
    router.push(
      `/admin-kanri/new?title=${encodeURIComponent(
        data.title
      )}&artist=${encodeURIComponent(data.artist)}`
    );
  }}
  className="
    px-3 py-1 rounded-lg
    bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500
    hover:from-sky-400 hover:via-sky-500 hover:to-sky-600
    text-white font-bold shadow-sm hover:shadow transition
  "
>
  Learned
</button>

        {/* Delete ボタン */}
        <button
          onClick={deleteItem}
          className="
            px-3 py-1 rounded-lg
            bg-white/10 hover:bg-white/20
            border border-white/10
            text-white transition
          "
        >
          Delete
        </button>
      </div>
    </div>
  );
}