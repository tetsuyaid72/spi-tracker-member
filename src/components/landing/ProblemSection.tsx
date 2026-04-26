import { X, Check } from "lucide-react";

const PROBLEMS = [
  "Data toko berantakan",
  "Sulit pantau sales",
  "Tidak tahu kunjungan",
  "Laporan lambat",
];

const SOLUTIONS = [
  "Semua toko terdata",
  "Monitoring real-time",
  "Peta interaktif",
  "Dashboard cepat",
];

export default function ProblemSection() {
  return (
    <section id="solusi" className="py-16 md:py-28 bg-white dark:bg-[#0c0e1a]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Problem */}
          <div>
            <h3 className="text-[13px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">Masalah Umum</h3>
            <div className="space-y-4">
              {PROBLEMS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                    <X size={12} className="text-gray-400" />
                  </div>
                  <p className="text-[15px] text-gray-600 dark:text-gray-400">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div>
            <h3 className="text-[13px] font-semibold text-black dark:text-white uppercase tracking-wider mb-6">Dengan SPI Tracker</h3>
            <div className="space-y-4">
              {SOLUTIONS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-white dark:text-black" />
                  </div>
                  <p className="text-[15px] text-gray-900 dark:text-white font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}