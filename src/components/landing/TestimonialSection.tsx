import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ahmad Rizki",
    role: "Supervisor Area - Distributor FMCG",
    text: "Sekarang monitoring toko jauh lebih mudah. Saya bisa lihat semua lokasi toko dan aktivitas sales dari HP kapan saja.",
    avatar: "A",
  },
  {
    name: "Siti Nurhaliza",
    role: "Owner - Grosir Banjarmasin",
    text: "Dashboard sangat membantu saya sebagai owner. Data toko rapi, laporan cepat, dan tim lapangan lebih disiplin.",
    avatar: "S",
  },
  {
    name: "Budi Santoso",
    role: "Sales Manager - PT Distribusi Nusantara",
    text: "Tim lapangan lebih disiplin dan terah sejak pakai SPI Tracker. Navigasi ke toko juga sangat membantu.",
    avatar: "B",
  },
];
export default function TestimonialSection() {
  return (
    <section className="py-20 md:py-28 bg-gray-50/50 dark:bg-[#0a0c16]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-3 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 rounded-full">Testimonial</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Dipercaya{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Tim Operasional</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Apa kata mereka yang sudah menggunakan SPI Tracker
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/20 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[13px] font-bold shadow-md">
                  {item.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}