"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-[#0c0e1a] dark:via-[#0f1228] dark:to-[#0c0e1a]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[12px] font-semibold text-blue-600 dark:text-blue-400">Platform Monitoring Toko #1 Indonesia</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight max-w-4xl mx-auto mb-6">
          Aplikasi{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Tracker Toko
          </span>{" "}
          & Monitoring Sales Lapangan{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Terbaik
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Pantau lokasi toko, kunjungan tim lapangan, distribusi area, dan data toko secara{" "}
          <span className="text-gray-700 dark:text-gray-300 font-medium">real-time</span> dalam satu dashboard modern.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/login"
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[15px] rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 transition-all duration-300 hover:-translate-y-0.5"
          >
            Coba Gratis Sekarang
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#fitur"
            className="group flex items-center gap-2 px-8 py-4 bg-white dark:bg-white/[0.06] text-gray-700 dark:text-gray-300 font-semibold text-[15px] rounded-2xl border-gray-200 dark:border-white/[0.1] hover:border-gray-300 dark:hover:border-white/[0.2] shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Play size={14} className="text-blue-600" />
            Lihat Demo
          </a>
        </div>

        {/* Dashboard mockup */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0c0e1a] z-10 pointer-events-none" />
          <div className="rounded-2xl border-gray-200/60 dark:border-white/[0.08] shadow-2xl shadow-gray-200/50 dark:shadow-black/30 overflow-hidden bg-white dark:bg-[#151827]">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 dark:bg-[#0c0e1a] border-b border-gray-100 dark:border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-[11px] text-gray-400 dark:text-gray-600 font-mono">spitracker.web.id/admin</span>
            </div>
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#151827] dark:to-[#0c0e1a] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                  <img src="/spi.png" alt="SPI Tracker" className="w-10 h-10 object-contain" />
                </div>
                <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Dashboard Preview</p>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">spitracker.web.id</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">100+</p>
            <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium mt-1">Toko Terdaftar</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">6</p>
            <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium mt-1">Wilayah Aktif</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">24/7</p>
            <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium mt-1">Real-time</p>
          </div>
        </div>
      </div>
    </section>
  );
}