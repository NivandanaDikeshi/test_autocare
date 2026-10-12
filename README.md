# AutoCare Pro — Vehicle Service Center Management System

A full-stack, enterprise-grade vehicle service management platform and administrative control suite built with **Next.js 16 (App Router)**, **Tailwind CSS**, **MongoDB (Mongoose)**, and **jsPDF**.

Designed according to industry-standard workshop specifications to streamline customer appointment scheduling, live bay repair tracking, customer vehicle registries, inventory spare parts management, automated invoicing, and vector PDF generation.

---

## 🌟 Key Highlights & Capabilities

### 🚗 Customer-Facing Portal
- **Modern Homepage (`/`)**: Dark glassmorphic design, animated performance metrics, feature pillars, and workshop gallery.
- **About Us (`/about`)**: Company background, technician certification standards, and satisfaction metrics.
- **Dynamic Services Catalog (`/services`)**: Filterable service catalog fetched live from MongoDB with search, category filtering, pricing in LKR, and estimated turnaround time.
- **Detailed Service Breakdown (`/services/[id]`)**: Full inspection checklist, warranty guidelines, FAQs, and instant booking action with pre-selected service.
- **Interactive Online Booking (`/booking`)**: Form validation for vehicle number, make/model, customer phone, service package, date, and preferred time slot with instant confirmation and tracker redirection.
- **Live Vehicle Repair Tracker (`/status`)**: Real-time 4-step progress stepper (`Received` → `Checking` → `Repairing` → `Completed`) with assigned technician name, inspection notes, and direct invoice links.
- **Invoices & Billing Lookup (`/billing`)**: Customer invoice search by vehicle registration plate or invoice ID, itemized labor and spare parts breakdown, payment status, and one-click **PDF invoice download**.
- **Contact & Inquiries (`/contact`)**: Customer message form connected directly to MongoDB and the Admin inbox.

### 🛡️ Admin Management Suite (Protected Portal)
- **Executive Dashboard (`/admin`)**: Real-time KPI counters (Bookings, Active Repairs, Total Revenue, Customers, Fleet Vehicles, Inventory, Inquiries), repair bay health overview, and recent bookings table with quick actions.
- **Services & Workshop Management (`/admin/services`)**:
  - **Tab 1: Service Catalog & Pricing**: Add, edit, or delete customer-facing packages, configure standard pricing, duration, and feature checklists.
  - **Tab 2: Live Workshop Bay Tracking**: Advance vehicles across the 4 repair stages, assign lead technicians, and update inspection notes.
- **Bookings Management (`/admin/bookings`)**: Filter bookings by status (`Pending`, `Confirmed`, `Completed`, `Cancelled`), view customer details, confirm appointments, and automatically generate itemized invoices.
- **Customer Directory (`/admin/customers`)**: Complete customer database with phone numbers, registered vehicles count, total appointments booked, and full service history drawer.
- **Vehicle Fleet Registry (`/admin/vehicles`)**: Vehicle registry linked to owners, plate numbers, manufacturing year, and maintenance statuses.
- **Spare Parts & Inventory (`/admin/parts`)**: Stock inventory with part numbers, unit prices, low-stock warnings, inline `+ / -` quantity adjusters, and new part creation.
- **Billing & Invoices (`/admin/billings`)**: Invoice generator with custom labor cost and itemized spare parts, payment status toggle (`Paid` / `Unpaid`), payment methods, and vector PDF download.
- **Inquiry Inbox (`/admin/contacts`)**: Customer inquiry inbox with read/unread statuses, direct `mailto:` reply action, and message management.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16.2.7](https://nextjs.org/) (App Router, Turbopack) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (Custom Dark Glassmorphic Design System) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) + HTTP-only Secure Cookies + Bcrypt (`bcryptjs`) |
| **PDF Engine** | [jsPDF](https://github.com/parallax/jsPDF) (Client & Server Vector PDF Generation) |
| **Icons** | [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas connection string

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory (or copy from `.env.example`):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/AutoCare
JWT_SECRET=autocare_secret_key
```

### 4. Seed Demo Database
Populate the database with sample administrators, services catalog, vehicles, customers, parts, and bookings:
```bash
node scripts/seedDemoData.js
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Admin Credentials

- **Login URL**: [http://localhost:3000/login](http://localhost:3000/login)
- **Email**: `admin@autocare.com`
- **Password**: `123456`
*(A convenient **"Fill Admin Demo Credentials"** button is also available on the login page for instant sign-in)*

---

## 🗺️ Application Sitemap

### Client Pages
- `/` — Homepage
- `/about` — About Us
- `/services` — Services Catalog
- `/services/[id]` — Dynamic Service Details Page
- `/booking` — Online Appointment Booking
- `/status` — Live Vehicle Repair Status Tracker
- `/billing` — Public Invoices & PDF Downloads
- `/contact` — Contact Workshop & Inquiries
- `/login` — Admin Authentication Portal

### Admin Pages (Protected by Middleware)
- `/admin` — KPI Analytics & Overview
- `/admin/services` — Service Catalog & Workshop Bay Tracking
- `/admin/bookings` — Bookings Manager
- `/admin/customers` — Customer Registry
- `/admin/vehicles` — Vehicle Registry
- `/admin/parts` — Spare Parts Inventory
- `/admin/billings` — Invoice Manager & Billing
- `/admin/contacts` — Inquiry Inbox

---

## 📡 REST API Reference

| Endpoint | Methods | Description |
| :--- | :--- | :--- |
| `/api/admin/login` | `POST` | Authenticate admin, issue JWT in HTTP-only cookie |
| `/api/admin/logout` | `POST` | Clear auth cookie |
| `/api/admin/stats` | `GET` | Dashboard KPI metrics and recent booking requests |
| `/api/services/catalog` | `GET`, `POST` | Fetch or add customer-facing service packages |
| `/api/services/catalog/[id]` | `GET`, `PUT`, `DELETE` | Read, update, or delete catalog service package |
| `/api/services` | `GET`, `POST` | Fetch or create workshop repair job cards |
| `/api/services/[id]` | `PUT`, `DELETE` | Update repair stage or delete job card |
| `/api/booking` | `GET`, `POST` | Query bookings (or lookup by plate) and create bookings |
| `/api/admin/bookings` | `GET` | List all customer bookings for admin |
| `/api/admin/bookings/[id]` | `GET`, `PATCH`, `PUT`, `DELETE` | Update booking status, auto-create bill |
| `/api/admin/customers` | `GET`, `POST` | Customer directory management |
| `/api/vehicles` | `GET`, `POST` | Vehicle fleet management |
| `/api/parts` | `GET`, `POST` | Spare parts catalog and stock adjustments |
| `/api/admin/billings` | `GET`, `POST` | Create or fetch workshop invoices |
| `/api/billing/[id]/invoice` | `GET` | Stream generated vector PDF invoice |
| `/api/contact` | `GET`, `POST` | Submit or retrieve customer inquiries |

---

## 📦 Production Build

To verify and build for production:
```bash
npm run build
```
All routes are pre-rendered or dynamically configured and compile with zero errors.
