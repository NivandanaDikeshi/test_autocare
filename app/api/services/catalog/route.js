import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ServiceItem from "@/models/ServiceItem";

const DEFAULT_SERVICES = [
  {
    title: "Vehicle Maintenance",
    slug: "vehicle-maintenance",
    category: "Preventative",
    price: 5000,
    estimatedTime: "2-3 Hours",
    description: "Comprehensive multi-point vehicle inspection, fluid flushes, belt checks, and factory scheduled maintenance services.",
    longDescription: "Our full-spectrum vehicle maintenance package is engineered to keep your car operating at maximum efficiency and reliability. Technicians perform a 50-point diagnostic inspection covering suspension, steering geometry, transmission fluid, battery condition, cooling systems, and air filtration. Recommended every 5,000 to 10,000 kilometers.",
    features: [
      "50-Point Comprehensive Vehicle Inspection",
      "Transmission & Differential Fluid Level Check",
      "Battery Cold Cranking Amperage (CCA) Test",
      "Serpentine Belt & Tensioner Inspection",
      "Cabin & Engine Air Filter Cleaning / Check",
      "Complimentary Exterior Body Wash",
    ],
    image: "/images/services/maintenance.jpg",
    popular: true,
  },
  {
    title: "Oil Change",
    slug: "oil-change",
    category: "Lube & Filter",
    price: 3500,
    estimatedTime: "45 Mins",
    description: "Full synthetic or premium mineral motor oil replacement with OEM oil filter renewal, fluid top-ups, and safety check.",
    longDescription: "Clean oil is the lifeblood of your engine. Our lube service drains degraded oil, removes sludge deposits, installs a brand-new high-efficiency OEM oil filter, and fills the crankcase with manufacturer-specified synthetic or blend oil. This protects critical valve train and piston components from premature friction wear.",
    features: [
      "High-Grade Synthetic / Blend Engine Oil (up to 4L)",
      "New OEM High-Flow Oil Filter Element",
      "Chassis & Linkage Greasing",
      "Windshield Washer & Coolant Fluid Top-Up",
      "Tire Pressure Check & Inflation",
    ],
    image: "/images/services/oil-changes.jpg",
    popular: true,
  },
  {
    title: "Brake Service",
    slug: "brake-service",
    category: "Braking & Safety",
    price: 4500,
    estimatedTime: "1-2 Hours",
    description: "Precision brake pad replacement, rotor machining, brake fluid flush, and ABS hydraulic system inspection for maximum stopping power.",
    longDescription: "Braking performance is non-negotiable for road safety. Our brake overhaul service inspects pad thickness, checks rotor runout, cleans caliper slide pins, bleeds old moisture-contaminated brake fluid, and tests ABS hydraulic pressure response for immediate, shudder-free stopping distances.",
    features: [
      "Front & Rear Pad Thickness Laser Measurement",
      "Brake Rotor Surface & Runout Evaluation",
      "Hydraulic Line & Caliper Piston Pressure Test",
      "DOT-4 High-Temperature Brake Fluid Flush",
      "Emergency Handbrake Cable Adjustment",
    ],
    image: "/images/services/brake-service.jpg",
    popular: false,
  },
  {
    title: "Engine Diagnostics",
    slug: "engine-diagnostics",
    category: "Electronics & Engine",
    price: 3000,
    estimatedTime: "1 Hour",
    description: "Computerized ECU scanner analysis, sensor calibration, electrical troubleshooting, and real-time engine telemetry tests.",
    longDescription: "Modern engines rely on dozens of microprocessors and sensors. When your Check Engine light illuminates, our diagnostic scanning tool communicates directly with your vehicle's ECU to retrieve active and stored trouble codes (DTCs), evaluate live fuel trim data, test O2 sensors, and verify ignition timing.",
    features: [
      "OBD-II Deep Computer Diagnostic Scan",
      "Live Sensor Telemetry & Fuel Trim Analysis",
      "Oxygen & Mass Air Flow (MAF) Sensor Testing",
      "Ignition Coil & Spark Pulse Verification",
      "Detailed Diagnostic Fault Code Report",
    ],
    image: "/images/services/diagnostics.jpg",
    popular: true,
  },
  {
    title: "Tire Services",
    slug: "tire-services",
    category: "Wheel & Suspension",
    price: 2500,
    estimatedTime: "1 Hour",
    description: "Laser computerized wheel alignment, high-speed dynamic balancing, tire rotation, puncture repairs, and new premium brand tire replacements.",
    longDescription: "Uneven tire wear ruins fuel economy and impairs wet-weather handling. We utilize 3D camera aligners to adjust camber, caster, and toe angles back to factory specifications. Dynamic balancing eliminates steering wheel vibration at highway speeds.",
    features: [
      "4-Wheel 3D Laser Alignment Calibration",
      "Computerized Dynamic Wheel Balancing",
      "4-Tire Cross Rotation Pattern Service",
      "Tread Depth & Wear Pattern Assessment",
      "Wheel Rim Bead Cleaning & Valve Stem Check",
    ],
    image: "/images/services/tire-service.jpg",
    popular: false,
  },
  {
    title: "Car Wash & Detailing",
    slug: "car-wash-detailing",
    category: "Detailing",
    price: 6000,
    estimatedTime: "3-4 Hours",
    description: "Pressure undercarriage wash, clay-bar decontamination, 3-stage exterior ceramic polish, and interior deep steam shampoo detailing.",
    longDescription: "Restore your vehicle's showroom look with our premium detailing service. We apply pH-neutral foam wash, remove road tar and iron fallout with synthetic clay, execute dual-action machine polishing with sealant, and deep-clean interior fabric, leather, carpets, and air conditioning vents.",
    features: [
      "Touchless Snow Foam & Undercarriage High-Pressure Wash",
      "Surface Clay Bar Paint Decontamination",
      "Dual-Action Machine Gloss Polish & Polymer Sealant",
      "Interior Steam Cleaning & Fabric Shampoo Extraction",
      "Leather Seat Conditioning & UV Protectant",
    ],
    image: "/images/services/detailing.jpg",
    popular: false,
  },
];

export async function GET(req) {
  try {
    await connectDB();

    let services = await ServiceItem.find().sort({ createdAt: 1 });

    // Auto-seed default catalog services if empty
    if (services.length === 0) {
      services = await ServiceItem.insertMany(DEFAULT_SERVICES);
    }

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("GET Services Catalog Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.price || !body.description) {
      return NextResponse.json(
        { success: false, message: "Title, price, and description are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const service = await ServiceItem.create({
      title: body.title.trim(),
      slug,
      category: body.category ? body.category.trim() : "General Service",
      price: Number(body.price) || 0,
      estimatedTime: body.estimatedTime ? body.estimatedTime.trim() : "1-2 Hours",
      description: body.description.trim(),
      longDescription: body.longDescription ? body.longDescription.trim() : body.description.trim(),
      features: Array.isArray(body.features)
        ? body.features
        : (body.features || "")
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
      image: body.image || "/images/services/maintenance.jpg",
      popular: Boolean(body.popular),
    });

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("POST Service Catalog Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
