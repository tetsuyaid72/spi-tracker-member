"use client";
import Link from "next/link";
import { ArrowRight, Play, MapPin, Store, Navigation, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-28 bg-white dark:bg-[#0c0e1a] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Sistem Tracker Toko{" "}
            <span className="block mt-2">untuk Mempermudah DeleveryMan.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8">
            Lacak lokasi toko member, Terintegrasi dengan googlemaps, tanpa perlu mengingat seluruh toko di otak dan cukup gunakan aplikasi ini.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[15px] font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all w-full sm:w-auto"
            >
              Mulai Sekarang
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="relative rounded-2xl border border-gray-200 dark:border-white/[0.08] shadow-2xl shadow-gray-200/50 dark:shadow-black/30 overflow-hidden bg-white dark:bg-[#151827]">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 dark:bg-[#0c0e1a] border-b border-gray-100 dark:border-white/[0.06]">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="ml-3 text-[11px] text-gray-400 dark:text-gray-600 font-mono">spitracker.web.id</span>
            </div>
            {/* Animated Dashboard Mockup */}
            <DashboardAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Animated Dashboard Preview ──

const MARKERS = [
  { x: 35, y: 25, color: "#f59e0b", delay: 0.3 },
  { x: 55, y: 35, color: "#ef4444", delay: 0.6 },
  { x: 42, y: 55, color: "#f97316", delay: 0.9 },
  { x: 68, y: 28, color: "#22c55e", delay: 1.2 },
  { x: 25, y: 45, color: "#3b82f6", delay: 1.5 },
  { x: 60, y: 60, color: "#f97316", delay: 1.8 },
  { x: 48, y: 40, color: "#ef4444", delay: 2.1 },
  { x: 75, y: 50, color: "#22c55e", delay: 2.4 },
  { x: 30, y: 65, color: "#f97316", delay: 2.7 },
];

const STATS = [
  { label: "Toko Aktif", value: "48", icon: Store },
  { label: "Wilayah", value: "6", icon: MapPin },
  { label: "Navigasi", value: "24/7", icon: Navigation },
  { label: "Real-time", value: "100%", icon: BarChart3 },
];
function DashboardAnimation() {
  const [visibleMarkers, setVisibleMarkers] = useState(0);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMarkers((prev) => {
        if (prev >= MARKERS.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    const statsTimer = setTimeout(() => setShowStats(true), 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(statsTimer);
    };
  }, []);

  return (
    <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#151827] dark:to-[#0c0e1a] relative overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
        {[...Array(8)].map((_, i) => (
          <div key={`h${i}`} className="absolute w-full h-px bg-gray-900 dark:bg-white" style={{ top: `${(i + 1) * 12}%` }} />
        ))}
        {[...Array(10)].map((_, i) => (
          <div key={`v${i}`} className="absolute h-full w-px bg-gray-900 dark:bg-white" style={{ left: `${(i + 1) * 10}%` }} />
        ))}
      </div>
      {/* Road lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.1]" viewBox="0 0 100" preserveAspectRatio="none">
        <path d="M10,30 Q30,25 50,35 T90,30" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-gray-600 dark:text-gray-400" />
        <path d="M20,50 Q40,45 60,55 T95,50" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-gray-600 dark:text-gray-400" />
        <path d="M5,70 Q25,65 45,72 T85,68" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-gray-600 dark:text-gray-400" />
        <path d="M40,10 Q42,30 38,50 T42,90" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-gray-600 dark:text-gray-400" />
        <path d="M65,5 Q63,25 67,45 T64,95" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-gray-600 dark:text-gray-400" />
      </svg>

      {/* Animated markers */}
      {MARKERS.map((marker, i) => (
        <div
          key={i}
          className="absolute transition-all duration-500"
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            transform: `translate(-50%, -100%) scale(${i < visibleMarkers ? 1 : 0})`,
            opacity: i < visibleMarkers ? 1 : 0,
          }}
        >
          <svg width="20" height="28" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z" fill={marker.color} />
            <circle cx="15" cy="15" r="6" fill="white" opacity="0.9" />
          </svg>
        </div>
      ))}

      {/* Pulse ring on latest marker */}
      {visibleMarkers > 0 && visibleMarkers <= MARKERS.length && (
        <div
          className="absolute w-8 h-8 rounded-full animate-ping"
          style={{
            left: `${MARKERS[Math.min(visibleMarkers - 1, MARKERS.length - 1)].x}%`,
            top: `${MARKERS[Math.min(visibleMarkers - 1, MARKERS.length - 1)].y}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: `${MARKERS[Math.min(visibleMarkers - 1, MARKERS.length - 1)].color}20`,
          }}
        />
      )}

      {/* Stats overlay */}
      <div
        className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 grid grid-cols-4 gap-1.5 sm:gap-2 transition-all duration-700 ${
          showStats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/90 dark:bg-[#1a1c2e]/90 backdrop-blur-md rounded-lg p-2 sm:p-2.5 border border-gray-200/30 dark:border-white/[0.06] text-center"
          >
            <stat.icon size={12} className="text-gray-400 dark:text-gray-500 mx-auto mb-1" />
            <p className="text-[13px] sm:text-[15px] font-bold text-gray-900 dark:text-white leading-none">{stat.value}</p>
            <span className="text-[8px] sm:text-[9px] text-gray-400 dark:text-gray-500 leading-none mt-0.5 block">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* SPI Logo watermark */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/60 dark:bg-[#1a1c2e]/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/30 dark:border-white/[0.04]">
        <div className="w-4 h-4 rounded bg-black dark:bg-white flex items-center justify-center p-0.5">
          <img src="/spi.png" alt="SPI" className="w-full h-full object-contain brightness-0 invert dark:invert-0" />
        </div>
        <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400">SPI Tracker</span>
      </div>
    </div>
  );
}