import { Building2, Users, Store, GitBranch } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Building2, label: "Distributor", desc: "Pantau jaringan distribusi" },
  { icon: Users, label: "Sales Team", desc: "Monitor tim lapangan" },
  { icon: Store, label: "UMKM & Grosir", desc: "Kelola toko dengan mudah" },
  { icon: GitBranch, label: "Multi Cabang", desc: "Satu dashboard semua cabang" },
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-gray-50/50 dark:bg-[#0a0c16] border-y border-gray-100 dark:border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <p className="text-center text-[12px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">
          Cocok Untuk Berbagai Kebutuhan
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/15 dark:to-indigo-500/15 flex items-center justify-center mb-3">
                <item.icon size={22} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-800 dark:text-gray-200 mb-1">{item.label}</h3>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}