import { MapPinOff, FileX, EyeOff, Shuffle, Clock, BarChart3 } from "lucide-react";

const PROBLEMS = [
  { icon: MapPinOff, title: "Tidak tahu sales ke toko mana", desc: "Lokasi kunjungan tim lapangan tidak terpantau sama sekali" },
  { icon: FileX, title: "Data toko berantakan", desc: "Informasi toko tersebar di banyak tempat tanpa sistem terpusat" },
  { icon: EyeOff, title: "Sulit memantau kunjungan", desc: "Tidak ada cara mudah untuk tracking kunjungan harian" },
  { icon: Shuffle, title: "Lokasi toko tercer", desc: "Koordinat dan alamat toko tidak terorganisir dengan baik" },
  { icon: Clock, title: "Laporan lambat", desc: "Butuh waktu lama untuk mengumpulkan dan menyusun laporan" },
  { icon: BarChart3, title: "Tidak ada dashboard real-time", desc: "Tidak bisa melihat kondisi lapangan secara langsung" },
];

export default function ProblemSection() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0c0e1a]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-bold text-red-500 dark:text-red-400 uppercase tracking-widest mb-3 px-3 py-1 bg-red-50 dark:bg-red-500/10 rounded-full">Masalah</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Masih Sulit Mengelola{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Tim Lapangan?</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Banyak perusahaan masih menghadapi tantangan ini setiap hari
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROBLEMS.map((item) => (
            <div
              key={item.title}
              className="group p-6 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] hover:border-red-200 dark:hover:border-red-500/20 hover:bg-red-50/30 dark:hover:bg-red-500/5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <item.icon size={20} className="text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-800 dark:text-gray-200 mb-2">{item.title}</h3>
              <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}