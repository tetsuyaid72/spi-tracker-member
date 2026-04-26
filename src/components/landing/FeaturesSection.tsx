import { Map, Users, ShieldCheck, Smartphone, Navigation, BarChart3 } from "lucide-react";

const FEATURES = [
  { icon: Map, title: "Peta Sebaran Toko", desc: "Visualisasi lokasi semua toko dalam peta interaktif" },
  { icon: Users, title: "Dashboard Tim", desc: "Pantau aktivitas dan performa tim lapangan" },
  { icon: ShieldCheck, title: "Approval Data", desc: "Sistem persetujuan data toko oleh admin" },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Akses dari HP kapan saja, di mana saja" },
  { icon: Navigation, title: "Navigasi Maps", desc: "Navigasi langsung ke lokasi toko" },
  { icon: BarChart3, title: "Statistik Real-time", desc: "Dashboard analitik data terkini" },
];

export default function FeaturesSection() {
  return (
    <section id="fitur" className="py-16 md:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">Fitur Lengkap untuk Operasional Modern</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">Semua yang Anda butuhkan untuk mengelola toko dan tim lapangan</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((item) => (
            <div
              key={item.title}
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-gray-100 transition-colors">
                <item.icon size={20} className="text-gray-700" />
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-[14px] text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}