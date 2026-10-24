"use client";

import { useState } from "react";
import { khodams, type Khodam } from "./khodams";

const ritualSteps = [
  "Menyalakan kemenyan...",
  "Memanggil leluhur...",
  "Membaca aura namamu...",
  "Khodam mulai menampakkan diri...",
];

export default function Home() {
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [hasil, setHasil] = useState<Khodam | null>(null);
  const [error, setError] = useState(false);

  function cekGas() {
    if (!nama.trim()) {
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);
    setHasil(null);
    setStep(0);

    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, ritualSteps.length - 1));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      const khodam = khodams[Math.floor(Math.random() * khodams.length)];
      setHasil(khodam);
      setLoading(false);
    }, 2200);
  }

  function restartLo() {
    setNama("");
    setHasil(null);
    setError(false);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0614] text-white">
      {/* background glow + stars */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-700/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="stars absolute inset-0" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-10">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-amber-300/80">
          ✦ Ramalan Gaib ✦
        </p>
        <h1 className="title-glow mb-2 text-center font-serif text-5xl font-bold sm:text-6xl">
          Cek Khodam
        </h1>
        <p className="mb-10 max-w-xs text-center text-sm text-purple-200/70">
          Ketik namamu, dan biarkan semesta mengungkap pendamping gaibmu.
        </p>

        <div className="w-full max-w-sm rounded-3xl border border-purple-400/20 bg-white/5 p-6 shadow-[0_0_60px_-15px_rgba(168,85,247,0.5)] backdrop-blur-xl">
          {/* orb */}
          <div className="mb-6 flex justify-center">
            <div
              className={`orb flex h-28 w-28 items-center justify-center rounded-full text-4xl ${
                loading ? "orb-active" : ""
              }`}
            >
              {loading ? "🔮" : hasil ? "👻" : "🕯️"}
            </div>
          </div>

          {!hasil && !loading && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                cekGas();
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                placeholder="Masukkan namamu"
                value={nama}
                onChange={(e) => {
                  setNama(e.target.value);
                  setError(false);
                }}
                className={`w-full rounded-xl border bg-black/30 px-4 py-3 text-center text-white placeholder:text-purple-200/40 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30 ${
                  error ? "border-red-400 animate-shake" : "border-purple-400/30"
                }`}
              />
              {error && (
                <p className="text-center text-xs text-red-300">
                  😠 Isi namamu dulu dong!
                </p>
              )}
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-3 font-semibold tracking-wide shadow-lg shadow-purple-900/50 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-fuchsia-500 active:translate-y-0"
              >
                Terawang Sekarang ✨
              </button>
            </form>
          )}

          {loading && (
            <p key={step} className="animate-fade-in text-center text-sm text-purple-200">
              {ritualSteps[step]}
            </p>
          )}

          {hasil && (
            <div className="animate-fade-in text-center">
              <p className="text-xs uppercase tracking-widest text-purple-300/70">
                Khodam milik <span className="text-white">{nama}</span>
              </p>
              <h2 className="title-glow my-3 font-serif text-3xl font-bold text-amber-200">
                {hasil.name}
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-purple-100/80">
                {hasil.meaning}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cekGas}
                  className="flex-1 rounded-xl border border-purple-400/30 py-2.5 text-sm transition hover:bg-white/10"
                >
                  Terawang Ulang
                </button>
                <button
                  onClick={restartLo}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2.5 text-sm font-semibold transition hover:from-purple-500 hover:to-fuchsia-500"
                >
                  Nama Lain
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="absolute bottom-0 left-0 z-10 w-full py-4">
        <p className="text-center text-xs text-purple-200/40">
          Copyright © 2026. Leru - All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
