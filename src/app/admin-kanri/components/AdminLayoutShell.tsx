"use client";

import type { ReactNode } from "react";

export default function AdminLayoutShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        mx-auto max-w-xl px-4 py-6 text-white
        bg-white/5 backdrop-blur-md rounded-xl
        border border-white/10 shadow-lg
      "
    >
      {children}
    </div>
  );
}