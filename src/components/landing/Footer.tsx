import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-[#080a14] border-t border-gray-100 dark:border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center p-1.5 shadow-lg shadow-blue-600/20">
                <img src="/spi.png" alt="SPI" className="w-full h-full object-contain" />
              </div>
              <span className="text-[15px] font-bold text-gray-900 dark:text-white">SPI Tracker</span>
            </div>
            <p className="text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed mb-4">
              Aplikasi tracker toko modern untuk memantau sales lapangan, lokasi toko, distribusi wilayah, dan dashboard operasional real-time.
            </p>
            <p className="text-[11px] text-gray-300 dark:text-gray-600">spitracker.web.id</p>
          </div>

          {/* Produk */}
          <div>
            <h4 className="text-[12px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wider mb-4">Produk</h4>
            <ul className="space-y-2.5">
              <li><a href="#fitur" className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Fitur</a></li>
              <li><a href="#solusi" className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Solusi</a></li>
              <li><a href="#benefit" className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Benefit</a></li>
              <li><a href="#faq" className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-[12px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wider mb-4">Perusahaan</h4>
            <ul className="space-y-2.5">
              <li><span className="text-[13px] text-gray-500 dark:text-gray-400">Tentang Kami</span></li>
              <li><span className="text-[13px] text-gray-500 dark:text-gray-400">Kontak</span></li>
              <li><span className="text-[13px] text-gray-500 dark:text-gray-400">Karir</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[12px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><span className="text-[13px] text-gray-500 dark:text-gray-400">Privacy Policy</span></li>
              <li><span className="text-[13px] text-gray-500 dark:text-gray-400">Terms of Service</span></li>
              <li><span className="text-[13px] text-gray-500 dark:text-gray-400">Cookie Policy</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200/60 dark:border-white/[0.04] flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-400 dark:text-gray-600">
            &copy; {new Date().getFullYear()} SPI Tracker. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-300 dark:text-gray-700">
            Made with ❤️ in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}