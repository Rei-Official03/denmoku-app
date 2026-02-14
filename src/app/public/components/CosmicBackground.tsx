"use client";

import { useEffect, useState } from "react";

type Star = {
  size: number;
  top: number;
  left: number;
  opacity: number;
  twinkleDelay: number;
};

type Glow = {
  id: number;
  size: number;
  x: number;
  y: number;
  opacity: number;
  driftDelay: number;
};

export default function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [glows, setGlows] = useState<Glow[]>([]);

  // ⭐ ランダム星（SSR では生成しない）
  useEffect(() => {
    const starArr = Array.from({ length: 180 }).map(() => ({
      size: Math.random() * 2 + 0.8,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.6 + 0.4,
      twinkleDelay: Math.random() * 5,
    }));
    setStars(starArr);

    // ✨ 光の粒子（漂う小さな光）
    const glowArr = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 18 + 8,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.4 + 0.2,
      driftDelay: Math.random() * 8,
    }));
    setGlows(glowArr);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Night gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A2A5A] via-[#1A2450] to-[#0F1A3A]" />

      {/* Nebula glows */}
      <div className="absolute -top-40 -left-32 w-[420px] h-[420px] rounded-full bg-[#AEEBFF]/25 blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-[#F7B2C4]/25 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-1/4 w-[520px] h-[520px] rounded-full bg-[#E8B27A]/15 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />

      {/* ⭐ Twinkling Stars */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: `${s.size}px`,
              height: `${s.size}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              opacity: s.opacity,
              animationDelay: `${s.twinkleDelay}s`,
            }}
          />
        ))}
      </div>

      {/* ✨ Floating Glows */}
      {glows.map((g) => (
        <div
          key={g.id}
          className="absolute rounded-full bg-white blur-xl animate-drift"
          style={{
            width: `${g.size}px`,
            height: `${g.size}px`,
            left: `${g.x}%`,
            top: `${g.y}%`,
            opacity: g.opacity,
            animationDelay: `${g.driftDelay}s`,
          }}
        />
      ))}

      {/* Decorative floating symbols */}
      <div className="absolute text-[#F7B2C4] text-xl animate-float left-12 top-20">✦</div>
      <div className="absolute text-[#F7B2C4] text-2xl animate-float-slow right-16 top-1/3">✧</div>
      <div className="absolute text-[#FFE08A] text-4xl animate-float left-1/2 top-10">☾</div>
      <div className="absolute text-[#AEEBFF] text-3xl animate-float-slow right-1/4 bottom-20">★</div>
      <div className="absolute text-[#AEEBFF] text-4xl animate-float left-10 top-1/3">♪</div>
      <div className="absolute text-[#F7B2C4] text-3xl animate-float-slow right-12 top-1/2">♫</div>
      <div className="absolute text-[#FF9A5C] text-5xl animate-float left-1/2 bottom-10">♪</div>

      {/* Shooting stars */}
      <div className="absolute w-1 h-1 bg-white rounded-full animate-shooting left-10 top-1/4"></div>
      <div className="absolute w-1 h-1 bg-[#AEEBFF] rounded-full animate-shooting2 right-20 top-1/2"></div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .animate-twinkle {
          animation: twinkle 3.5s ease-in-out infinite;
        }

        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-40px) translateX(20px); opacity: 0.2; }
        }
        .animate-drift {
          animation: drift 9s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { opacity: 0.9; }
          100% { transform: translateY(-40px); opacity: 0.5; }
        }
        .animate-float {
          animation: float 7s linear infinite;
        }
        .animate-float-slow {
          animation: float 11s linear infinite;
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