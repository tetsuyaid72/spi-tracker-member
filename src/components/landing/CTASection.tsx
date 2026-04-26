import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-28 bg-white dark:bg-[#0c0e1a]">
      <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Siap Upgrade Operasional Toko Anda?
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Mulai kelola toko dan tim lapangan dengan lebih efisien hari ini
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[15px] font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full sm:w-auto max-w-xs mx-auto"
        >
          Mulai Sekarang
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}