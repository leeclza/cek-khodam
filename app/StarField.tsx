"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; tw: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let raf = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((w * h) / 2500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1, // depth: closer stars are bigger and faster
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function frame(t: number) {
      ctx!.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.y -= s.z * 0.25;
        s.x += s.z * 0.08;
        if (s.y < 0) s.y = h;
        if (s.x > w) s.x = 0;

        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t / 900 + s.tw));
        const r = s.z * 1.6;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = s.z > 0.85 ? `rgba(253,230,138,${alpha})` : `rgba(233,213,255,${alpha})`;
        ctx!.fill();
      }

      if (Math.random() < 0.006 && meteors.length < 2) {
        meteors.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.4,
          vx: -(6 + Math.random() * 4),
          vy: 3 + Math.random() * 2,
          life: 1,
        });
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const grad = ctx!.createLinearGradient(m.x, m.y, m.x - m.vx * 12, m.y - m.vy * 12);
        grad.addColorStop(0, `rgba(255,255,255,${m.life})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(m.x, m.y);
        ctx!.lineTo(m.x - m.vx * 12, m.y - m.vy * 12);
        ctx!.stroke();

        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.012;
        if (m.life <= 0) meteors.splice(i, 1);
      }

      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-screen w-screen" />;
}
