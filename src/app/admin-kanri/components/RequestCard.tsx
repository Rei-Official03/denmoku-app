"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type RequestItem = {
  id: string;
  title: string;
  artist: string;
  from_name: string;
  created_at: string;
  processed: boolean;
};

type Props = {
  item: RequestItem;
  onChange: () => void;
};

export default function RequestCard({ item, onChange }: Props) {
  const router = useRouter();
  const [data, setData] = useState<RequestItem | null>(item);

  // -----------------------------
  // Mark as processed (Supabase)
  // -----------------------------
  const markProcessed = async () => {
    if (!data) return;

    const { error } = await supabase
      .from("requests")
      .update({ processed: true })
      .eq("id", data.id);

    if (error) {
      console.error("Supabase update error:", error);
      return;
    }

    setData({ ...data, processed: true });
    onChange();
  };

  // -----------------------------
  // Delete item (Supabase)
  // -----------------------------
  const deleteItem = async () => {
    if (!data) return;
    if (!confirm("本当に削除しますか？")) return;

    const { error } = await supabase
      .from("requests")
      .delete()
      .eq("id", data.id);

    if (error) {
      console.error("Supabase delete error:", error);
      return;
    }

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
      <div className="text-xs text-white/50 mt-1">From: {data.from_name}</div>
      <div className="text-[10px] text-white/40 mt-1">
        {new Date(data.created_at).toLocaleString()}
      </div>

      <div className="flex gap-2 mt-3 text-xs">
        {/* Learned ボタン */}
        <button
          onClick={async () => {
            await markProcessed();
            await deleteItem();

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