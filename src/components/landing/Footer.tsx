export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-gray-500">
            &copy; {new Date().getFullYear()} SPI Tracker - Developer Hasbuna
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Tentang</a>
            <a href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Kontak</a>
            <a href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}