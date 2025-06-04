import { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { OrderItem } from "../../../interfaces/order_item/order_item";

const Receipt = ({
  order_item,
  order_email,
  first_name,
  last_name,
}: {
  order_item: OrderItem[];
  order_email: string;
  first_name: string;
  last_name: string;
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [hasUploaded, setHasUploaded] = useState(false);

  const total = (order_item ?? []).reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const fullname = `${first_name} ${last_name}`;

  useEffect(() => {
    if (hasUploaded) return; // prevent multiple uploads

    const generateAndUploadPDF = async () => {
      if (!receiptRef.current) return;

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output("blob");

      const formData = new FormData();
      formData.append("receipt_pdf", pdfBlob, "receipt.pdf");

      try {
        const response = await fetch("http://localhost:8000/api/saveReceipt", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("Receipt PDF successfully saved on server!");
          setHasUploaded(true); // mark as done here
        } else {
          alert("Failed to save receipt PDF on server.");
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
        alert("An error occurred while saving PDF.");
      }
    };

    generateAndUploadPDF();
  }, [order_item, order_email, first_name, last_name, hasUploaded]);

  return (
    <div>
      <div ref={receiptRef} className="card mt-3 p-3">
        <div className="card-header">
          <strong>Receipt</strong>
        </div>
        <div className="p-3">
          <p>
            <strong>Ordered By:</strong> {fullname} <br />
            <strong>Email:</strong> {order_email} <br />
          </p>
        </div>
        <ul className="list-group list-group-flush">
          {order_item.map((item) => (
            <li
              key={item.item_id}
              className="list-group-item d-flex justify-content-between"
            >
              <span>
                {item.item.item_name} x {item.quantity}
              </span>
              <span>₱{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
          <li className="list-group-item d-flex justify-content-between">
            <strong>Total:</strong>
            <strong>₱{total.toFixed(2)}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Receipt;
