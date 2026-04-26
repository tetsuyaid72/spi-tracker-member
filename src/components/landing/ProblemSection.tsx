import { X, Check } from "lucide-react";

const PROBLEMS = [
  "Susah mengingat toko member",
  "Buang buang waktu",
  "Tidak bisa aplikasi saat Rit 2",
  "Setoran jadi lambat",
];

const SOLUTIONS = [
  "Semua toko terdata",
  "Sangat mudah digunakan",
  "Peta interaktif",
  "Dashboard cepat",
];

export default function ProblemSection() {
  return (
    <section id="solusi" className="py-16 md:py-28 bg-white dark:bg-[#0c0e1a]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Sebelum & Sesudah SPI Tracker
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Lihat perbedaan nyata dalam operasional tim lapangan Anda
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-8 max-w-4xl mx-auto">
          {/* Problem Card */}
          <div className="rounded-2xl border-red-100 dark:border-red-500/10 bg-red-50/30 dark:bg-red-500/[0.03] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
                <X size={16} className="text-red-500" />
              </div>
              <h3 className="text-[13px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider">Tanpa SPI Tracker</h3>
            </div>
            <div className="space-y-4">
              {PROBLEMS.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center shrink-0">
                    <X size={12} className="text-red-400 dark:text-red-400" />
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-gray-600 dark:text-gray-400">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Card */}
          <div className="rounded-2xl border border-emerald-100 dark:border-emerald-500/10 bg-emerald-50/30 dark:bg-emerald-500/[0.03] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center">
                <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Dengan SPI Tracker</h3>
            </div>
            <div className="space-y-4">
              {SOLUTIONS.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-gray-900 dark:text-white font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}