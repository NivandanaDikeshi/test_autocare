import Image from "next/image";

export default function ServicesPage() {
  const services = [
    {
      image: "/images/services/maintenance.jpg",
      title: "Vehicle Maintenance",
      description:
        "Comprehensive maintenance services to keep your vehicle running at peak performance.",
    },
    {
      image: "/images/services/oil-changes.jpg",
      title: "Oil Change",
      description:
        "Professional oil replacement using high-quality oils and filters.",
    },
    {
      image: "/images/services/brake-service.jpg",
      title: "Brake Service",
      description:
        "Complete brake inspection, repair, and replacement for maximum safety.",
    },
    {
      image: "/images/services/diagnostics.jpg",
      title: "Engine Diagnostics",
      description:
        "Advanced diagnostic tools to quickly identify and resolve engine issues.",
    },
    {
      image: "/images/services/tire-service.jpg",
      title: "Tire Services",
      description:
        "Tire replacement, balancing, rotation, and alignment services.",
    },
    {
      image: "/images/services/detailing.jpg",
      title: "Car Wash & Detailing",
      description:
        "Premium interior and exterior cleaning to keep your vehicle looking new.",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Our Services
          </span>

          <h1 className="text-5xl md:text-6xl font-black mt-6 mb-6">
            Professional
            <span className="text-blue-500"> Vehicle Care</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-slate-400">
            We provide a complete range of automotive services designed
            to keep your vehicle safe, reliable, and performing at its best.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Service Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* Card Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  {service.title}
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  {service.description}
                </p>

                <button className="mt-6 text-blue-500 hover:text-blue-400 font-semibold transition">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mt-20">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500 transition">
            <h2 className="text-4xl font-bold text-blue-500">
              15K+
            </h2>
            <p className="text-slate-400 mt-2">
              Vehicles Serviced
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500 transition">
            <h2 className="text-4xl font-bold text-blue-500">
              50+
            </h2>
            <p className="text-slate-400 mt-2">
              Expert Technicians
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500 transition">
            <h2 className="text-4xl font-bold text-blue-500">
              98%
            </h2>
            <p className="text-slate-400 mt-2">
              Satisfaction Rate
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500 transition">
            <h2 className="text-4xl font-bold text-blue-500">
              24/7
            </h2>
            <p className="text-slate-400 mt-2">
              Customer Support
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Service Your Vehicle?
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-white/90 mb-8">
            Schedule your appointment today and experience professional
            automotive care from trusted experts.
          </p>

          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:scale-105 transition duration-300">
            Book a Service
          </button>
        </div>
      </div>
    </section>
  );
}