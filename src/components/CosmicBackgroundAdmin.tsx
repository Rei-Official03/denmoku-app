"use client";

import { useEffect, useState } from "react";

type Star = {
  size: number;
  top: number;
  left: number;
  opacity: number;
  twinkleDelay: number;
};

type ShootingStar = {
  length: number;
  angle: number;
  duration: number;
  delay: number;
  top: number;
  left: number;
};

export default function CosmicBackgroundAdmin() {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    // 星の粒
    const starArr = Array.from({ length: 120 }).map(() => ({
      size: Math.random() * 2 + 0.8,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleDelay: Math.random() * 5,
    }));
    setStars(starArr);

    // 流れ星（ここを useEffect に入れるのが重要）
    const shootingArr = Array.from({ length: 10 }).map(() => ({
      length: 150 + Math.random() * 150,
      angle: -35 - Math.random() * 20,
      duration: 1.2 + Math.random() * 1.0,
      delay: Math.random() * 6,
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setShootingStars(shootingArr);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B4F]/85 via-[#0A1E63]/90 to-[#081A4A]/95" />
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_70%)] mix-blend-screen" />

      {/* 星の粒 */}
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

      {/* 流れ星（SSR と CSR が一致する） */}
      <div className="absolute inset-0 pointer-events-none">
        {shootingStars.map((s, i) => (
          <div
            key={i}
            className="absolute h-[2px] bg-white/80 rounded-full shadow-[0_0_8px_white]"
            style={{
              width: `${s.length}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              transform: `rotate(${s.angle}deg)`,
              animation: `shooting ${s.duration}s linear infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .animate-twinkle {
          animation: twinkle 3.5s ease-in-out infinite;
        }

        @keyframes shooting {
          0% {
            opacity: 0;
            transform: translateX(0) translateY(0) rotate(-45deg);
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(-300px) translateY(300px) rotate(-45deg);
          }
        }
      `}</style>
    </div>
  );
}