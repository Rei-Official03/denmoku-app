"use client";

import type { SongDiff } from "./types";

const STORAGE_KEY = "song_edits_v1";
const DIFF_EVENT = "song_edits_updated";

// diff を読み込む
export function loadDiffs(): SongDiff[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as SongDiff[];
    }
    return [];
  } catch {
    return [];
  }
}

// diff を保存する（イベント発火つき）
export function saveDiffs(diffs: SongDiff[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(diffs));

  // diff 更新イベントを飛ばす
  window.dispatchEvent(new Event(DIFF_EVENT));
}

// diff の更新イベントを購読する
export function subscribeDiffs(callback: () => void) {
  const handler = () => callback();

  // 自前のイベント
  window.addEventListener(DIFF_EVENT, handler);

  // 他タブで localStorage が変わった時も反映
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", storageHandler);

  // クリーンアップ関数
  return () => {
    window.removeEventListener(DIFF_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}