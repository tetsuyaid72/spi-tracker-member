import { Map, MapPin, Globe2, Users, Navigation, ShieldCheck, BarChart3, UserCog } from "lucide-react";

const SOLUTIONS = [
  { icon: Map, title: "Peta Sebaran Toko Interaktif", desc: "Visualisasi lokasi semua toko dalam peta interaktif dengan marker berwarna per wilayah" },
  { icon: MapPin, title: "Tracker Lokasi Toko", desc: "Lacak dan simpan koordinat GPS setiap toko secara akurat" },
  { icon: Globe2, title: "Manajemen Wilayah", desc: "Kelompokkan toko berdasarkan wilayah distribusi dengan kode warna" },
  { icon: Users, title: "Dashboard Tim Sales", desc: "Pantau aktivitas dan performa setiap anggota tim lapangan" },
  { icon: Navigation, title: "Navigasi Google Maps", desc: "Navigasi langsung ke lokasi toko dengan satu klik" },
  { icon: ShieldCheck, title: "Approval Data Toko", desc: "Sistem persetujuan data toko oleh admin sebelum masuk database" },
  { icon: BarChart3, title: "Statistik Real-time", desc: "Dashboard analitik dengan data toko, wilayah, dan aktivitas terkini" },
  { icon: UserCog, title: "Multi User Admin & Staff", desc: "Kelola akses berbeda untuk admin, supervisor, dan sales lapangan" },
];
export default function SolutionSection() {
  return (
    <section id="solusi" className="py-20 md:py-28 bg-gray-50/50 dark:bg-[#0a0c16]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 rounded-full">Solusi</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Semua Kebutuhan Monitoring Toko{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dalam Satu Sistem</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            SPI Tracker menyediakan solusi lengkap untuk operasional tim lapangan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SOLUTIONS.map((item) => (
            <div
              key={item.title}
              className="group p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <item.icon size={22} className="text-white" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-800 dark:text-gray-200 mb-2">{item.title}</h3>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}