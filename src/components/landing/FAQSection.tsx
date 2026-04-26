"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Apa itu SPI Tracker?",
    a: "SPI Tracker adalah aplikasi monitoring seluruh toko dengan aplikasi ini bisa membantu anda mengelola lokasi toko, menambahkan toko baru, dan dMempermudah perkerjaan anda.",
  },
  {
    q: "Apakah bisa dipakai di HP?",
    a: "Ya, SPI Tracker mobile-friendly dan bisa diakses dari browser HP manapun. Bahkan bisa di-install sebagai aplikasi PWA tanpa perlu download dari Play Store.",
  },
  {
    q: "Apakah bisa banyak user?",
    a: "Tentu. SPI Tracker mendukung multi-user dengan role berbeda: Admin, dan User sebagai Deliman. Setiap role memiliki akses sesuai kebutuhannya.",
  },
  {
    q: "Apakah ada peta toko?",
    a: "Ya, dilengkapi peta interaktif yang menampilkan semua lokasi toko dengan marker berwarna per wilayah dan navigasi langsung ke Google Maps.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-28 bg-white dark:bg-[#0c0e1a]">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Pertanyaan Umum</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border border-gray-100 dark:border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white dark:bg-[#151827] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-[14px] sm:text-[15px] font-medium text-gray-900 dark:text-gray-100 pr-4">{faq.q}</span>
                  {isOpen ? (
                    <Minus size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  ) : (
                    <Plus size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white dark:bg-[#151827]">
                    <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}