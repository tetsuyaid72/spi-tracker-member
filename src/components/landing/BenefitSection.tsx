import { Clock, Eye, FileText, Database, MapPin, TrendingUp } from "lucide-react";

const BENEFITS = [
  { icon: Clock, title: "Hemat Waktu Operasional", desc: "Otomatisasi proses monitoring yang sebelumnya manual dan memakan waktu" },
  { icon: Eye, title: "Sales Lebih Terpantau", desc: "Ketahui aktivitas tim lapangan secara real-time dari mana saja" },
  { icon: FileText, title: "Owner Dapat Laporan Cepat", desc: "Dashboard ringkas yang langsung menampilkan data penting" },
  { icon: Database, title: "Data Lebih Rapi", desc: "Semua informasi toko tersimpan terstruktur dalam satu sistem" },
  { icon: MapPin, title: "Wilayah Lebih Tertata", desc: "Distribusi area toko terorganisir dengan baik per wilayah" },
  { icon: TrendingUp, title: "Produktivitas Meningkat", desc: "Tim lebih fokus dan efisien dengan tools yang tepat" },
];
export default function BenefitSection() {
  return (
    <section id="benefit" className="py-20 md:py-28 bg-white dark:bg-[#0c0e1a]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">Benefit</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Kenapa Memilih{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">SPI Tracker?</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Manfaat nyata yang langsung dirasakan oleh tim operasional Anda
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((item, i) => (
            <div
              key={item.title}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.03] dark:to-white/[0.01] border border-gray-100 dark:border-white/[0.06] hover:shadow-xl hover:shadow-emerald-100/30 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute top-4 right-5 text-[48px] font-extrabold text-gray-100 dark:text-white/[0.03] leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                  <item.icon size={20} className="text-white" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-200 mb-2">{item.title}</h3>
                <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}