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
// 基本ユーティリティ（内部用）
// -----------------------------

function load(): RequestItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    // 配列でない or 型が崩れている場合の保険
    if (!Array.isArray(parsed)) return [];

    return parsed as RequestItem[];
  } catch {
    return [];
  }
}

function save(data: RequestItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage が満杯などの例外は握りつぶす
  }
}

// -----------------------------
// CRUD 操作
// -----------------------------

// 全件取得（新しい順）
export function getAllRequests(): RequestItem[] {
  return load().sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// 追加
export function addRequest(item: RequestItem) {
  const list = load();
  list.push(item);
  save(list);
}

// 削除
export function removeRequest(id: string) {
  const list = load().filter((r) => r.id !== id);
  save(list);
}

// 全削除
export function clearRequests() {
  save([]);
}

// 更新（部分更新）
export function updateRequest(id: string, update: Partial<RequestItem>) {
  const list = load().map((r) =>
    r.id === id ? { ...r, ...update } : r
  );
  save(list);
}