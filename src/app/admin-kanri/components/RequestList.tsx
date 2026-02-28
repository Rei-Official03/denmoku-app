"use client";

import { useEffect, useState, useCallback } from "react";
import RequestCard from "./RequestCard";
import type { RequestItem } from "@/lib/requestStorage";

export default function RequestList() {
  const [requests, setRequests] = useState<RequestItem[]>([]);

  // -----------------------------
  // 安全な localStorage load()
  // -----------------------------
  const load = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem("requests_v1");
      const list = raw ? (JSON.parse(raw) as RequestItem[]) : [];
      setRequests(list);
    } catch {
      setRequests([]);
    }
  }, []);

  // 初回ロード
  useEffect(() => {
    load();
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
        {/* 未処理 */}
        {unprocessed.map((req) => (
          <RequestCard key={req.id} item={req} onChange={load} />
        ))}

        {/* 処理済み */}
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