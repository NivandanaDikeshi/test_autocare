import PDFDocument from "pdfkit";

export const generateInvoicePDF = (bill) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();

    const chunks = [];
    doc.on("data", (c) => chunks.push(c));

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.fontSize(20).text("INVOICE", { align: "center" });

    doc.moveDown();
    doc.text(`Invoice: ${bill.invoiceNumber}`);
    doc.text(`Customer: ${bill.customerName}`);
    doc.text(`Amount: Rs ${bill.amount}`);

    doc.end();
  });
};