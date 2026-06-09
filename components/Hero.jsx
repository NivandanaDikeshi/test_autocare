import Link from "next/link";
import Gallery from "./Gallery";

export default function Hero() {
  return (
    <>
      {/* HERO SECTION */}
      <section
        className="h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage: "url('/images/hero-car.jpg')",
        }}
      >
        <div className="max-w-7xl mx-auto px-5">
          <div className="max-w-2xl text-white">
            <h1 className="text-6xl font-bold">
              Vehicle Service Center Management System
            </h1>

            <p className="mt-5 text-gray-300">
              Book services, track repairs, manage billing,
              and maintain vehicle history online.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/booking"
                className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Book Service
              </Link>

              <Link
                href="/services"
                className="border border-white px-6 py-3 rounded-lg hover:bg-white/10 transition"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Gallery />
    </>
  );
}