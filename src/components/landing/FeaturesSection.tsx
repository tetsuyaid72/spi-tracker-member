import { BarChart3, Flame, Moon, Smartphone, Lock, ShieldCheck, Download, Search, Navigation, Palette } from "lucide-react";

const FEATURES = [
  { icon: BarChart3, title: "Dashboard Analytics", desc: "Statistik lengkap dalam satu tampilan" },
  { icon: Flame, title: "Heatmap Wilayah", desc: "Visualisasi kepadatan toko per area" },
  { icon: Moon, title: "Dark Mode", desc: "Tampilan gelap yang nyaman di mata" },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Optimal di semua ukuran layar" },
  { icon: Lock, title: "Login Multi Role", desc: "Admin, supervisor, dan sales" },
  { icon: ShieldCheck, title: "Approval System", desc: "Verifikasi data sebelum masuk sistem" },
  { icon: Download, title: "Data Export", desc: "Export data ke CSV dan Excel" },
  { icon: Search, title: "Fast Search Toko", desc: "Cari toko dalam hitungan detik" },
  { icon: Navigation, title: "GPS Navigation", desc: "Navigasi langsung ke lokasi toko" },
  { icon: Palette, title: "Custom Branding", desc: "Sesuaikan dengan identitas perusahaan" },
];
export default function FeaturesSection() {
  return (
    <section id="fitur" className="py-20 md:py-28 bg-white dark:bg-[#0c0e1a]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">Fitur</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Fitur Premium Untuk{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Operasional Modern</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Dilengkapi fitur-fitur canggih yang dirancang untuk kebutuhan tim lapangan
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {FEATURES.map((item) => (
            <div
              key={item.title}
              className="group p-5 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] hover:bg-white dark:hover:bg-white/[0.04] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/15 dark:to-purple-500/15 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <item.icon size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-[12px] font-bold text-gray-800 dark:text-gray-200 mb-1">{item.title}</h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}