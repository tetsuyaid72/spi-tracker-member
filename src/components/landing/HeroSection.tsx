import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-28 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Kelola Toko & Tim Lapangan{" "}
            <span className="block mt-2">Lebih Rapi, Lebih Cepat.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Pantau kunjungan toko, distribusi wilayah, dan performa tim lapangan dalam satu dashboard modern yang simpel digunakan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white text-[15px] font-medium rounded-lg hover:bg-gray-800 transition-all w-full sm:w-auto"
            >
              Mulai Gratis
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#fitur"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 text-[15px] font-medium rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto"
            >
              <Play size={14} className="text-gray-500" />
              Lihat Demo
            </a>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="relative rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden bg-white">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="ml-3 text-[11px] text-gray-400 font-mono">spitracker.web.id</span>
            </div>
            {/* Mockup content */}
            <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mx-auto mb-4">
                  <img src="/spi.png" alt="SPI" className="w-10 h-10 object-contain brightness-0 invert" />
                </div>
                <p className="text-sm font-medium text-gray-400">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}