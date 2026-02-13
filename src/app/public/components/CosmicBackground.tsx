"use client";

import { useEffect, useState } from "react";

type Star = {
  w: number;
  h: number;
  top: number;
  left: number;
  opacity: number;
};

type Glow = {
  id: number;
  size: number;
  x: number;
  y: number;
  opacity: number;
};

export default function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [glows, setGlows] = useState<Glow[]>([]);

  // ランダム星（SSR では生成しない）
  useEffect(() => {
    const arr = Array.from({ length: 120 }).map(() => ({
      w: Math.random() * 2 + 1,
      h: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.8 + 0.2,
    }));
    setStars(arr);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Night gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A2A5A] via-[#1A2450] to-[#0F1A3A]" />

      {/* Nebula glows */}
      <div className="absolute -top-40 -left-32 w-[420px] h-[420px] rounded-full bg-[#AEEBFF]/25 blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-[#F7B2C4]/25 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-1/4 w-[520px] h-[520px] rounded-full bg-[#E8B27A]/15 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />

      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute bg-white/80 rounded-full"
            style={{
              width: `${s.w}px`,
              height: `${s.h}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Glows（光の粒子） */}
      {glows.map((g) => (
        <div
          key={g.id}
          className="absolute rounded-full bg-white blur-xl"
          style={{
            width: `${g.size}px`,
            height: `${g.size}px`,
            left: `${g.x}%`,
            top: `${g.y}%`,
            opacity: g.opacity,
          }}
        />
      ))}

      {/* Pink stars */}
      <div className="absolute text-[#F7B2C4] text-xl animate-[float_7s_linear_infinite] left-12 top-20">✦</div>
      <div className="absolute text-[#F7B2C4] text-2xl animate-[float_9s_linear_infinite] right-16 top-1/3">✧</div>

      {/* Moon */}
      <div className="absolute text-[#FFE08A] text-4xl animate-[float_10s_linear_infinite] left-1/2 top-10">☾</div>

      {/* Saturn */}
      <div className="absolute text-[#AEEBFF] text-3xl animate-[float_12s_linear_infinite] right-1/4 bottom-20">★</div>

      {/* Music notes */}
      <div className="absolute text-[#AEEBFF] text-4xl animate-[float_6s_linear_infinite] left-10 top-1/3">♪</div>
      <div className="absolute text-[#F7B2C4] text-3xl animate-[float_7s_linear_infinite] right-12 top-1/2">♫</div>
      <div className="absolute text-[#FF9A5C] text-5xl animate-[float_9s_linear_infinite] left-1/2 bottom-10">♪</div>

      {/* Shooting stars */}
      <div className="absolute w-1 h-1 bg-white rounded-full animate-shooting left-10 top-1/4"></div>
      <div className="absolute w-1 h-1 bg-[#AEEBFF] rounded-full animate-shooting2 right-20 top-1/2"></div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { opacity: 0.9; }
          100% { transform: translateY(-40px); opacity: 0.5; }
        }
        @keyframes shooting {
          0% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
          100% { transform: translateX(200px) translateY(80px) scale(0); opacity: 0; }
        }
        @keyframes shooting2 {
          0% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
          100% { transform: translateX(-220px) translateY(120px) scale(0); opacity: 0; }
        }
        .animate-shooting {
          animation: shooting 2.8s linear infinite;
        }
        .animate-shooting2 {
          animation: shooting2 3.2s linear infinite;
        }
      `}</style>
    </div>
  );
}