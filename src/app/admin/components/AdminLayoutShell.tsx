"use client";

import type { ReactNode } from "react";

export default function AdminLayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 text-white">
      {children}
    </div>
  );
}