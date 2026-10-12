import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import connectDB from "../lib/mongodb.js";
import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";
import Part from "../models/Part.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import Billing from "../models/Billing.js";
import Service from "../models/Service.js";
import ServiceItem from "../models/ServiceItem.js";
import Contact from "../models/Contact.js";

async function seedData() {
  await connectDB();
  console.log("Connected to MongoDB for seeding...");

  // 1. Admin
  const adminExists = await Admin.findOne({ email: "admin@autocare.com" });
  if (!adminExists) {
    await Admin.create({
      email: "admin@autocare.com",
      password: "123456",
      role: "admin",
    });
    console.log("✅ Seeded default Admin user (admin@autocare.com / 123456)");
  }

  // 2. Customers
  const customerCount = await Customer.countDocuments();
  if (customerCount === 0) {
    await Customer.insertMany([
      {
        fullName: "Nivandana Dikeshi",
        phone: "+94774903146",
        email: "nivandana@example.com",
        address: "45 Galle Road, Colombo 03",
        vehicles: [
          { vehicleNumber: "CAA-12344", vehicleModel: "BMW 320i" },
          { vehicleNumber: "CMN-2345", vehicleModel: "Honda Civic" },
        ],
        totalBookings: 3,
        notes: "Preferred customer, frequent detailing services",
      },
      {
        fullName: "Ravini Amaya",
        phone: "0770254687",
        email: "ravini@example.com",
        address: "12 Peradeniya Road, Kandy",
        vehicles: [{ vehicleNumber: "VZR-5467", vehicleModel: "Honda Vezel" }],
        totalBookings: 2,
        notes: "Requested synthetic oil on all lube jobs",
      },
      {
        fullName: "Manuka Perera",
        phone: "+94771122334",
        email: "manuka@example.com",
        address: "88 High Level Road, Nugegoda",
        vehicles: [{ vehicleNumber: "WP-CAB-8899", vehicleModel: "Toyota Prius" }],
        totalBookings: 1,
        notes: "Hybrid battery health check scheduled",
      },
    ]);
    console.log("✅ Seeded sample customers");
  }

  // 3. Parts
  const partCount = await Part.countDocuments();
  if (partCount === 0) {
    await Part.insertMany([
      { partName: "Synthetic Engine Oil 5W-30 (4L)", category: "Oils & Lubricants", stock: 24, price: 12500, supplier: "Mobil 1 Lanka" },
      { partName: "OEM Premium Oil Filter", category: "Filters", stock: 42, price: 2800, supplier: "Denso Parts" },
      { partName: "Ceramic Front Brake Pads Set", category: "Braking System", stock: 12, price: 14500, supplier: "Brembo Distributor" },
      { partName: "Heavy Duty Air Filter Element", category: "Filters", stock: 3, price: 3200, supplier: "Bosch Lanka" },
      { partName: "Iridium Long-Life Spark Plugs (Set of 4)", category: "Engine Components", stock: 18, price: 9800, supplier: "NGK Spark" },
      { partName: "12V 65Ah Maintenance-Free Battery", category: "Electrical & Battery", stock: 4, price: 32000, supplier: "Exide Lanka" },
      { partName: "High Performance Dot-4 Brake Fluid (500ml)", category: "Oils & Lubricants", stock: 30, price: 1950, supplier: "Castrol Direct" },
    ]);
    console.log("✅ Seeded sample spare parts inventory");
  }

  // 4. Vehicles
  const vehicleCount = await Vehicle.countDocuments();
  if (vehicleCount === 0) {
    await Vehicle.insertMany([
      {
        ownerName: "Nivandana Dikeshi",
        ownerPhone: "+94774903146",
        model: "BMW 320i",
        number: "CAA-12344",
        year: "2021",
        status: "In Service",
      },
      {
        ownerName: "Ravini Amaya",
        ownerPhone: "0770254687",
        model: "Honda Vezel",
        number: "VZR-5467",
        year: "2020",
        status: "In Service",
      },
      {
        ownerName: "Nivandana Dikeshi",
        ownerPhone: "+94774903146",
        model: "Honda Civic",
        number: "CMN-2345",
        year: "2019",
        status: "Completed",
      },
      {
        ownerName: "Manuka Perera",
        ownerPhone: "+94771122334",
        model: "Toyota Prius",
        number: "WP-CAB-8899",
        year: "2018",
        status: "Active",
      },
    ]);
    console.log("✅ Seeded vehicle fleet");
  }

  // 5. Workshop Services (Bay jobs)
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        customerName: "Ravini Amaya",
        vehicleNumber: "VZR-5467",
        serviceType: "Tire Replacement",
        mechanic: "Saman Perera",
        notes: "Wheel balancing & 4-tire alignment check",
        status: "Checking",
      },
      {
        customerName: "Nivandana Dikeshi",
        vehicleNumber: "CAA-12344",
        serviceType: "Engine Diagnostics",
        mechanic: "Lead Tech Kamal",
        notes: "ECU scan completed, oxygen sensor calibrated",
        status: "Repairing",
      },
      {
        customerName: "Manuka Perera",
        vehicleNumber: "CMN-2345",
        serviceType: "Oil Change",
        mechanic: "Dilan Silva",
        notes: "Full synthetic oil flush & OEM filter replaced",
        status: "Completed",
      },
    ]);
    console.log("✅ Seeded sample workshop services");
  }

  // 6. Billings
  const billCount = await Billing.countDocuments();
  if (billCount === 0) {
    await Billing.insertMany([
      {
        invoiceNumber: "INV-2026-001",
        customerName: "Manuka Perera",
        customerPhone: "+94774903146",
        customerEmail: "manuka@example.com",
        vehicleNumber: "CAA-12344",
        vehicleModel: "BMW",
        serviceType: "Brake Repair & Pad Replacement",
        amount: 18500,
        totalAmount: 18500,
        status: "Paid",
        paymentStatus: "Paid",
        spareParts: [
          { name: "Ceramic Front Brake Pads", price: 14500, quantity: 1 },
          { name: "Labor & Brake Bleeding", price: 4000, quantity: 1 },
        ],
      },
      {
        invoiceNumber: "INV-2026-002",
        customerName: "Nivandana Dikeshi",
        customerPhone: "+94774903146",
        customerEmail: "nivandana@example.com",
        vehicleNumber: "CMN-2345",
        vehicleModel: "Honda Civic",
        serviceType: "Car Wash & Detailing",
        amount: 8500,
        totalAmount: 8500,
        status: "Unpaid",
        paymentStatus: "Unpaid",
        spareParts: [
          { name: "Interior Deep Steam Shampoo", price: 5000, quantity: 1 },
          { name: "Ceramic Spray Wax & Polish", price: 3500, quantity: 1 },
        ],
      },
      {
        invoiceNumber: "INV-2026-003",
        customerName: "Ravini Amaya",
        customerPhone: "0770254687",
        customerEmail: "ravini@example.com",
        vehicleNumber: "VZR-5467",
        vehicleModel: "Honda Vezel",
        serviceType: "Tire Replacement & Wheel Alignment",
        amount: 28000,
        totalAmount: 28000,
        status: "Unpaid",
        paymentStatus: "Unpaid",
        spareParts: [
          { name: "Dunlop Touring Tires (Pair)", price: 24000, quantity: 1 },
          { name: "Computerized Laser Alignment", price: 4000, quantity: 1 },
        ],
      },
    ]);
    console.log("✅ Seeded sample invoices");
  }

  // 7. Contacts
  const contactCount = await Contact.countDocuments();
  if (contactCount === 0) {
    await Contact.insertMany([
      {
        name: "Chamara Wijesinghe",
        email: "chamara@example.com",
        phone: "+94712345678",
        message: "Hi, do you offer hybrid battery health reports and conditioning?",
        status: "Unread",
      },
      {
        name: "Dilini Fernando",
        email: "dilini@example.com",
        phone: "+94765432109",
        message: "Can I book a ceramic coating package for next Saturday morning?",
        status: "Read",
      },
    ]);
    console.log("✅ Seeded sample inquiries");
  }

  console.log("🌟 Demo database successfully verified and ready!");
  process.exit(0);
}

seedData().catch((err) => {
  console.error("Error seeding data:", err);
  process.exit(1);
});
