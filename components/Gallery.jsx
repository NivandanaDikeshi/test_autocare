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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* TITLE */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest font-semibold">
          Workshop Facility
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">
          Modern Vehicle Service Center
        </h2>

        <p className="text-slate-400 mt-3 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
          Take a look at our modern service bays, advanced computerized diagnostic
          equipment, certified technicians, and professional vehicle care solutions.
        </p>
      </div>

      {/* IMAGE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-3xl border border-white/10 shadow-xl bg-slate-900"
          >
            <Image
              src={img}
              alt={`Vehicle Service Bay ${index + 1}`}
              width={600}
              height={700}
              className="w-full h-[260px] sm:h-[320px] object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent group-hover:from-blue-950/90 transition duration-500" />
            
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-xs font-semibold text-white/90 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                Service Bay 0{index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-14 sm:mt-16 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Certified Automotive Engineering
        </h3>

        <p className="max-w-3xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed">
          From preventative maintenance and computerized engine diagnostics to
          high-performance brake services and genuine parts installations,
          our workshop guarantees peerless reliability and manufacturer-level care.
        </p>
      </div>
    </section>
  );
}