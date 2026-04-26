import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          Siap Upgrade Operasional Toko Anda?
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Mulai kelola toko dan tim lapangan dengan lebih efisien hari ini
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[15px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Mulai Sekarang
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}