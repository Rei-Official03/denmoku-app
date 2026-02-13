// requestStorage.ts
// 公開側 RequestBox と完全互換のリクエスト管理ユーティリティ

export type RequestItem = {
  id: string;        // uuid
  title: string;     // 曲名
  artist: string;    // アーティスト名
  from: string;      // 送信者
  createdAt: string; // ISO 文字列
  processed: boolean;
};

const STORAGE_KEY = "requests_v1";

// -----------------------------
// 基本ユーティリティ
// -----------------------------

function load(): RequestItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(data: RequestItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// -----------------------------
// CRUD 操作
// -----------------------------

export function getAllRequests(): RequestItem[] {
  return load().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addRequest(item: RequestItem) {
  const list = load();
  list.push(item);
  save(list);
}

export function removeRequest(id: string) {
  const list = load().filter((r) => r.id !== id);
  save(list);
}

export function clearRequests() {
  save([]);
}

export function updateRequest(id: string, update: Partial<RequestItem>) {
  const list = load().map((r) =>
    r.id === id ? { ...r, ...update } : r
  );
  save(list);
}