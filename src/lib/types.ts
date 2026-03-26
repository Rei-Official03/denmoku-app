// --------------------------------------
// 公式データ（songData.ts に入っている元データ）
// --------------------------------------
export type Song = {
  id: number;
  title: string;
  titleKana: string;
  artist: string;
  artistKana: string;
  scale: string;
  genre: string;
  instUrl: string;
  skillLevel: string; // ◎ / ○ / △ / ×
  isPublic: boolean;
  createdAt: string; // "YYYY-MM-DD"
};

// --------------------------------------
// 差分データ（diffStorage に保存される部分的な変更）
// --------------------------------------
export type SongDiff = {
  id: number;
  isNew?: boolean; // 新規曲なら true

  // 変更された項目だけ入る（全部 optional）
  title?: string;
  titleKana?: string;
  artist?: string;
  artistKana?: string;
  scale?: string;
  genre?: string;
  instUrl?: string;
  skillLevel?: string;
  isPublic?: boolean;
  createdAt?: string;
};

// --------------------------------------
// UI 用の最終データ（mergeSongs の出力）
// Song + SongDiff + playCount + hasDiff を合成したもの
// --------------------------------------
export type SongWithMeta = {
  id: number;
  title: string;
  titleKana: string;
  artist: string;
  artistKana: string;
  scale: string;
  genre: string;
  instUrl: string;
  skillLevel: string;
  isPublic: boolean;
  createdAt: string;

  // 追加メタ情報
  playCount: number; // localStorage から取得
  hasDiff?: boolean; // diff がある曲
  isNew?: boolean;   // 新規曲
};