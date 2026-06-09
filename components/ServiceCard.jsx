export default function ServiceCard({
  title,
  description,
  price,
  period = "month",
  badge = "Popular",
  features = [],
  ctaText = "Get Started",
  featured = false,
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl p-8 shadow-xl transition-all duration-500 hover:-translate-y-3 
      ${
        featured
          ? "bg-gradient-to-br from-green-600/20 via-slate-900 to-slate-950 border border-green-500/30"
          : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      }`}
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      {/* Floating Glow Circle */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-500/20 blur-3xl"></div>

      <div className="relative z-10">
        {/* Badge */}
        {badge && (
          <span className="inline-block rounded-full bg-green-500/20 px-4 py-1 text-xs font-medium text-green-300">
            {badge}
          </span>
        )}

        {/* Title */}
        <h3 className="mt-5 text-3xl font-bold text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-4 leading-relaxed text-slate-300">
          {description}
        </p>

        {/* Features */}
        {features.length > 0 && (
          <ul className="mt-5 space-y-2 text-slate-300 text-sm">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Price */}
        <div className="mt-6 flex items-end gap-1">
          <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-5xl font-extrabold text-transparent">
            {price}
          </span>
          <span className="text-slate-400 mb-2">/{period}</span>
        </div>

        {/* Button */}
        <button
          className={`mt-8 w-full rounded-2xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105
          ${
            featured
              ? "bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500"
              : "bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}