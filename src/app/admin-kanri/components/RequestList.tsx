"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import RequestCard from "./RequestCard";

type RequestItem = {
  id: string;
  title: string;
  artist: string;
  from_name: string;
  created_at: string;
  processed: boolean;
};

export default function RequestList() {
  const [requests, setRequests] = useState<RequestItem[]>([]);

  // -----------------------------
  // Supabase からリクエスト取得
  // -----------------------------
  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("request") // ← 単数で正しい
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
  }, []);

  // 初回ロード
  useEffect(() => {
    load();
  }, [load]);

  // -----------------------------
  // Realtime 購読（INSERT / UPDATE / DELETE）
  // -----------------------------
  useEffect(() => {
    const channel = supabase
      .channel("request-changes") // ← 任意だが意味が明確
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "request",
        },
        () => {
          load(); // 変更があったら即リロード
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  if (requests.length === 0) {
    return (
      <div className="mt-6 text-white/60 text-sm">
        📭 現在リクエストはありません
      </div>
    );
  }

  const unprocessed = requests.filter((r) => !r.processed);
  const processed = requests.filter((r) => r.processed);

  return (
    <div className="mt-6">
      <div className="text-white/80 text-sm mb-3">
        📩 リクエスト曲（{requests.length}）
      </div>

      <div className="space-y-3">
        {unprocessed.map((req) => (
          <RequestCard key={req.id} item={req} onChange={load} />
        ))}

        {processed.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10 opacity-70 space-y-3">
            {processed.map((req) => (
              <RequestCard key={req.id} item={req} onChange={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}