"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Apa itu SPI Tracker?",
    a: "SPI Tracker adalah aplikasi manajemen toko berbasis web dan mobile yang membantu tim lapangan, sales, admin, dan owner dalam memantau lokasi toko, distribusi wilayah, kunjungan toko, navigasi, status persetujuan, serta pelacakan data toko secara real-time.",
  },
  {
    q: "Apakah bisa dipakai di HP?",
    a: "Ya! SPI Tracker dirancang mobile-first dan bisa diakses dari browser HP manapun. Bahkan bisa di-install sebagai aplikasi (PWA) di Android dan iOS tanpa perlu download dari Play Store.",
  },
  {
    q: "Apakah bisa digunakan banyak user?",
    a: "Tentu. SPI Tracker mendukung multi-user dengan role berbeda: Admin, Supervisor, dan Sales/Deliman. Setiap role memiliki akses dan tampilan yang sesuai kebutuhannya.",
  },
  {
    q: "Apakah ada fitur peta toko?",
    a: "Ya, SPI Tracker dilengkapi peta interaktif yang menampilkan semua lokasi toko dengan marker berwarna per wilayah, heatmap kepadatan, dan navigasi langsung ke Google Maps.",
  },
  {
    q: "Bisa custom untuk perusahaan?",
    a: "Ya, SPI Tracker bisa disesuaikan dengan branding dan kebutuhan spesifik perusahaan Anda. Hubungi kami untuk konsultasi lebih lanjut.",
  },
  {
    q: "Apakah data aman?",
    a: "Keamanan data adalah prioritas kami. SPI Tracker menggunakan enkripsi, autentikasi berlapis, dan database cloud yang aman. Data Anda hanya bisa diakses oleh user yang berwenang.",
  },
];
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-white dark:bg-[#0c0e1a]">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 rounded-full">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Pertanyaan yang{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sering Ditanyakan</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "bg-blue-50/50 dark:bg-blue-500/5 border-blue-200/60 dark:border-blue-500/20 shadow-sm"
                    : "bg-gray-50/50 dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.06] hover:border-gray-200 dark:hover:border-white/[0.1]"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`text-[14px] font-semibold pr-4 ${
                    isOpen ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"
                  }`}>
                {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-blue-500" : "text-gray-400 dark:text-gray-500"
                    }`}
                />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}