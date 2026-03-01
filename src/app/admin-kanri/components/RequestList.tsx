"use client";

import { useEffect, useState } from "react";
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
  const load = async () => {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
  };

  // 初回ロード
  useEffect(() => {
    load();
  }, []);

  // -----------------------------
  // Realtime 購読（INSERT / UPDATE / DELETE）
  // -----------------------------
  useEffect(() => {
    const channel = supabase
      .channel("requests-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // insert / update / delete 全部
          schema: "public",
          table: "requests",
        },
        () => {
          load(); // 変更があったら即リロード
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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