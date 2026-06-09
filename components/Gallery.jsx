import Image from "next/image";

export default function Gallery() {
  const images = [
    "/images/gallery/service1.jpg",
    "/images/gallery/service2.jpg",
    "/images/gallery/service3.jpg",
    "/images/gallery/service4.jpg",
    "/images/gallery/service5.jpg",
    "/images/gallery/service6.jpg",
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      {/* TITLE */}
      <div className="text-center mb-12">
        <p className="text-blue-500 uppercase tracking-[6px] font-semibold">
          Our Gallery
        </p>

        <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-white">
          Vehicle Service Center
        </h2>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Take a look at our modern service center, advanced diagnostic
          equipment, expert technicians, and professional vehicle care
          solutions designed to keep your vehicle performing at its best.
        </p>
      </div>

      {/* IMAGE GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-3xl border border-white/10 shadow-xl"
          >
            <Image
              src={img}
              alt={`Vehicle Service ${index + 1}`}
              width={600}
              height={700}
              className="w-full h-[320px] object-cover group-hover:scale-110 transition duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-blue-900/40 transition duration-500" />
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-16 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Professional Automotive Care
        </h3>

        <p className="max-w-3xl mx-auto text-gray-400">
          From routine maintenance and oil changes to engine diagnostics,
          brake repairs, tire services, and complete vehicle inspections,
          our experienced technicians ensure every vehicle receives the
          highest standard of service.
        </p>
      </div>
    </section>
  );
}