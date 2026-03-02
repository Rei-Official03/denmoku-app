import type { Song } from "@/lib/songData";

export function pickRandomPublicSongs(songs: Song[]) {
  // 公開曲だけ
  const publicSongs = songs.filter((s) => s.isPublic);

  // skillLevel ごとに分類
  const good = publicSongs.filter((s) => s.skillLevel === "◎");
  const ok = publicSongs.filter((s) => s.skillLevel === "○");
  const weak = publicSongs.filter((s) => s.skillLevel === "△");

  // ランダム取得
  const pick = (arr: Song[]) =>
    arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

  let a = pick(good); // ◎
  let b = pick(ok);   // ○
  let c = pick(weak); // △

  // 足りないカテゴリを補う
  if (!a) a = pick(ok) || pick(weak);
  if (!b) b = pick(good) || pick(weak);
  if (!c) c = pick(good) || pick(ok);

  // 最終的に 3 曲返す
  return [a, b, c].filter(Boolean) as Song[];
}