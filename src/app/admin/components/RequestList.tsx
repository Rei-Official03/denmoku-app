"use client";

import { useEffect, useState } from "react";
import RequestCard from "./RequestCard";
import type { RequestItem } from "@/app/public/requestStorage";

export default function RequestList() {
  const [requests, setRequests] = useState<RequestItem[]>([]);

  const load = () => {
    const raw = localStorage.getItem("requests_v1");
    setRequests(raw ? JSON.parse(raw) : []);
  };

  useEffect(() => {
    load();
  }, []);

  if (requests.length === 0) return null;

  const unprocessed = requests.filter((r) => !r.processed);
  const processed = requests.filter((r) => r.processed);

  return (
    <div className="mt-6">
      <div className="text-white/80 text-sm mb-2">
        📩 リクエスト曲 ({requests.length})
      </div>

      <div className="space-y-3">
        {unprocessed.map((req) => (
          <RequestCard key={req.id} item={req} onChange={load} />
        ))}

        {processed.length > 0 && (
          <div className="mt-4 opacity-60">
            {processed.map((req) => (
              <RequestCard key={req.id} item={req} onChange={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}