export default function TrustSection() {
  const items = ["Distributor", "Sales Team", "UMKM", "Multi Cabang"];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <p className="text-center text-[13px] text-gray-400 mb-8">Dipakai untuk operasional modern</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {items.map((item) => (
            <div key={item} className="text-[15px] font-medium text-gray-300">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}