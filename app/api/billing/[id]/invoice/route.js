import connectDB from "@/lib/mongodb";
import Billing from "@/models/Billing";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const bill = await Billing.findById(params.id);

    if (!bill) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    const doc = new PDFDocument();

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    const pdfPromise = new Promise((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    // PDF Content
    doc.fontSize(22).text("Vehicle Service Invoice", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(14).text(`Customer: ${bill.customerName}`);
    doc.text(`Vehicle: ${bill.vehicleNumber}`);
    doc.text(`Service: ${bill.serviceType}`);
    doc.text(`Amount: Rs ${bill.amount}`);
    doc.text(`Status: ${bill.status}`);
    doc.text(
      `Date: ${new Date(bill.createdAt).toLocaleDateString()}`
    );

    doc.moveDown();
    doc.text("Thank you for choosing our service.");

    doc.end();

    const pdfBuffer = await pdfPromise;

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename=invoice-${bill._id}.pdf`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}