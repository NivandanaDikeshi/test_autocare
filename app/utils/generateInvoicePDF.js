import jsPDF from "jspdf";

export const generateInvoicePDF = (invoice) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("AutoCare Invoice", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `Invoice No: ${invoice.invoiceNumber}`,
    20,
    40
  );

  doc.text(
    `Customer: ${invoice.customerName}`,
    20,
    50
  );

  doc.text(
    `Vehicle: ${invoice.vehicle}`,
    20,
    60
  );

  doc.text(
    `Service: ${invoice.service}`,
    20,
    70
  );

  doc.text(
    `Amount: Rs. ${invoice.amount}`,
    20,
    80
  );

  doc.save(`${invoice.invoiceNumber}.pdf`);
};