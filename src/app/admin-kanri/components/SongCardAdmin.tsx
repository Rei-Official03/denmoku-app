"use client";

import { useRouter } from "next/navigation";
import type { Song } from "@/lib/songData";

type Props = {
  song: Song | { id: number; title: string; artist: string; isNew: true };
};

export default function SongCardAdmin({ song }: Props) {
  const router = useRouter();

  // isNew が true のときだけ新規曲扱い
  const isNewSong = (song as any).isNew === true;

  const handleClick = () => {
    if (isNewSong) {
      router.push(`/admin-kanri/diff-edit/${song.id}`);
    } else {
      router.push(`/admin-kanri/song/${song.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        p-4 rounded-xl bg-white/10 backdrop-blur-md
        border border-white/10 shadow-md text-white
        cursor-pointer transition
        hover:bg-white/20 hover:shadow-lg active:scale-[0.98]
      "
    >
      <div className="text-sm font-bold drop-shadow-sm">
        {song.title}
        {isNewSong && <span className="ml-2 text-xs text-sky-300">NEW</span>}
      </div>
      <div className="text-xs text-white/70 mt-0.5">{song.artist}</div>
    </div>
  );
}