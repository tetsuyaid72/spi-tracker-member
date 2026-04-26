import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%260%22 height=%2260%22 viewBox=%220 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-400/10 rounded-full blur-[80px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
          Siap Digitalisasi Monitoring Toko Anda?
        </h2>
        <p className="text-lg text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
          Bergabung sekarang dan rasakan kemudahan mengelola tim lapangan dengan teknologi modern
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold text-[15px] rounded-2xl shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Coba Sekarang
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold text-[15px] rounded-2xl border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            <MessageCircle size={16} />
            Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  );
}