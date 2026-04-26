const STATS = [
  { value: "48+", label: "Toko Terdaftar" },
  { value: "6", label: "Wilayah Aktif" },
  { value: "24/7", label: "Akses Dashboard" },
  { value: "100%", label: "Cloud Based" },
];

export default function StatsSection() {
  return (
    <section className="py-16 md:py-28 bg-white dark:bg-[#0c0e1a]">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
              <p className="text-[12px] sm:text-[13px] text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}