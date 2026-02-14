"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RequestItem } from "@/app/public/requestStorage";

type Props = {
  item: RequestItem;
  onChange: () => void;
};

export default function RequestCard({ item, onChange }: Props) {
  const router = useRouter();
  const [data, setData] = useState<RequestItem>(item);

  // 型付き load()
  const load = (): RequestItem[] => {
    const raw = localStorage.getItem("requests_v1");
    return raw ? (JSON.parse(raw) as RequestItem[]) : [];
  };

  const save = (list: RequestItem[]) => {
    localStorage.setItem("requests_v1", JSON.stringify(list));
  };

  const markProcessed = () => {
    const list = load();

    // r に型をつける
    const updated = list.map((r: RequestItem) =>
      r.id === data.id ? { ...r, processed: true } : r
    );

    save(updated);
    setData({ ...data, processed: true });
    onChange();
  };

  const deleteItem = () => {
    if (!confirm("本当に削除しますか？")) return;

    // filter の r にも型をつける
    const list = load().filter((r: RequestItem) => r.id !== data.id);

    save(list);
    setData(null as any);
    onChange();
  };

  if (!data) return null;

  return (
    <div
      className={`p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-md text-white ${
        data.processed ? "opacity-50" : ""
      }`}
    >
      <div className="text-sm font-bold">{data.title}</div>
      <div className="text-xs text-white/70">{data.artist}</div>
      <div className="text-xs text-white/50 mt-1">From: {data.from}</div>
      <div className="text-[10px] text-white/40 mt-1">
        {new Date(data.createdAt).toLocaleString()}
      </div>

      <div className="flex gap-2 mt-3 text-xs">
        <button
          onClick={() => {
            markProcessed();
            router.push(
              `/admin/new?title=${encodeURIComponent(
                data.title
              )}&artist=${encodeURIComponent(data.artist)}`
            );
          }}
          className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition"
        >
          Learned
        </button>

        <button
          onClick={deleteItem}
          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}