import connectDB from "@/lib/mongodb";
import Billing from "@/models/Billing";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const bill = await Billing.findById(id);

    if (!bill) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // --- Colors ---
    const primaryColor = [2, 132, 199]; // #0284c7
    const darkColor = [15, 23, 42]; // #0f172a
    const grayColor = [100, 116, 139]; // #64748b
    const lightBg = [241, 245, 249]; // #f1f5f9

    // --- Header ---
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AUTOCARE PRO", 20, 25);

    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Automotive Service & Maintenance Center", 20, 31);
    doc.text("123 AutoCare Street, Colombo 03, Sri Lanka", 20, 36);
    doc.text("Tel: +94 77 123 4567 | Email: support@autocarepro.com", 20, 41);

    // --- Invoice Meta (Right side) ---
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INVOICE", 190, 25, { align: "right" });

    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const invoiceNum = bill.invoiceNumber || "INV-" + String(bill._id).slice(-6);
    doc.text(`Invoice #: ${invoiceNum}`, 190, 32, { align: "right" });
    doc.text(`Date: ${new Date(bill.createdAt || Date.now()).toLocaleDateString()}`, 190, 37, { align: "right" });

    // Status Badge
    const isPaid = bill.status === "Paid";
    doc.setFillColor(isPaid ? 220 : 254, isPaid ? 252 : 243, isPaid ? 231 : 199);
    doc.roundedRect(165, 41, 25, 6, 1.5, 1.5, "F");
    doc.setTextColor(isPaid ? 22 : 180, isPaid ? 101 : 83, isPaid ? 52 : 9);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text((bill.status || "UNPAID").toUpperCase(), 177.5, 45.2, { align: "center" });

    // Divider Line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    // --- Billing Info Boxes ---
    // Bill To
    doc.setFillColor(...lightBg);
    doc.roundedRect(20, 56, 80, 28, 2, 2, "F");
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("BILL TO:", 24, 62);

    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(bill.customerName || "Customer", 24, 68);

    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Phone: ${bill.customerPhone || "N/A"}`, 24, 74);
    doc.text(`Email: ${bill.customerEmail || "N/A"}`, 24, 79);

    // Vehicle Info
    doc.setFillColor(...lightBg);
    doc.roundedRect(110, 56, 80, 28, 2, 2, "F");
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("VEHICLE DETAILS:", 114, 62);

    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(bill.vehicleNumber || "Vehicle", 114, 68);

    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Model: ${bill.vehicleModel || "Standard Model"}`, 114, 74);
    doc.text(`Service: ${bill.serviceType || "Maintenance"}`, 114, 79);

    // --- Items Table ---
    const tableTop = 93;
    doc.setFillColor(15, 23, 42); // dark header
    doc.rect(20, tableTop, 170, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("DESCRIPTION / SERVICE ITEM", 25, tableTop + 5.5);
    doc.text("QTY", 140, tableTop + 5.5, { align: "center" });
    doc.text("AMOUNT (Rs.)", 185, tableTop + 5.5, { align: "right" });

    let y = tableTop + 14;

    const items =
      bill.spareParts && bill.spareParts.length > 0
        ? bill.spareParts
        : [
            {
              name: bill.serviceType || "Primary Workshop Service Charge",
              quantity: 1,
              price: Number(bill.amount || bill.totalAmount) || 5000,
            },
          ];

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.setFontSize(9);

    items.forEach((item, index) => {
      // Alternate row background
      if (index % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(20, y - 5, 170, 8, "F");
      }

      doc.text(item.name || "Service Item", 25, y);
      doc.text(String(item.quantity || 1), 140, y, { align: "center" });
      const itemPrice = Number(item.price || 0);
      doc.text(`Rs. ${itemPrice.toLocaleString()}`, 185, y, { align: "right" });

      y += 8;
    });

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;

    // --- Total Summary ---
    const total = Number(bill.amount || bill.totalAmount || 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text("Total Billed Amount:", 130, y);
    doc.setTextColor(16, 185, 129); // green
    doc.text(`Rs. ${total.toLocaleString()}`, 185, y, { align: "right" });

    y += 7;
    doc.setFontSize(9.5);
    doc.setTextColor(...grayColor);
    doc.text("Payment Status:", 130, y);
    doc.setTextColor(isPaid ? 16 : 225, isPaid ? 185 : 29, isPaid ? 129 : 72);
    doc.text(bill.status || "Unpaid", 185, y, { align: "right" });

    // --- Footer Note ---
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 260, 190, 260);

    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Thank you for choosing AutoCare Pro! All parts and workmanship carry a 30-day warranty.",
      105,
      266,
      { align: "center" }
    );
    doc.text("For questions or support, contact support@autocarepro.com or +94 77 123 4567.", 105, 271, {
      align: "center",
    });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${invoiceNum}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate invoice PDF", error: error.message },
      { status: 500 }
    );
  }
}