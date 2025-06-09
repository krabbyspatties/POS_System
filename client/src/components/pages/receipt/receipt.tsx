"use client";

import { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { OrderItem } from "../../../interfaces/order_item/order_item";
import ReceiptService from "../../../services/ReceiptService";

export const submitReceiptToMake = async ({
  pdf_url,
  email,
  first_name,
  last_name,
  total,
}: {
  pdf_url: string;
  email: string;
  first_name: string;
  last_name: string;
  total: number;
}) => {
  const response = await fetch(
    "https://hook.eu2.make.com/8m05dc2mqjetfh6qv5hirpncue4nk5yp",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdf_url, email, first_name, last_name, total }),
    }
  );

  if (!response.ok) throw new Error("Failed to send receipt to Make.com");
};

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
  console.log("Order Items:", order_item);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = (order_item ?? []).reduce((sum, item) => {
    const finalPrice =
      typeof item.price === "number" ? item.price : Number(item.price || 0);
    const lineTotal = finalPrice * item.quantity;
    return sum + lineTotal;
  }, 0);

  const fullname = `${first_name} ${last_name}`;

  useEffect(() => {
    if (hasUploaded || isLoading) return;

    const generateAndUploadPDF = async () => {
      if (!receiptRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
        });
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
        formData.append("email", order_email);
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("total", total.toString());

        const response = await ReceiptService.saveReceipt(formData);
        const data = response.data;

        if (data.url) {
          setHasUploaded(true);

          if (data.message.includes("failed to send")) {
            setError("Receipt saved but email delivery may be delayed.");
          } else {
            alert("Receipt processed successfully!");
          }
        }
      } catch (uploadError: any) {
        console.error("Error uploading PDF:", uploadError);
        setError(
          `Failed to save receipt: ${uploadError.message || "Unknown error"}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    generateAndUploadPDF();
  }, [
    order_item,
    order_email,
    first_name,
    last_name,
    hasUploaded,
    isLoading,
    total,
  ]);

  console.log("Order items:", order_item);

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
          {order_item.map((item) => {
            const finalPrice =
              typeof item.price === "number"
                ? item.price
                : Number(item.price || 0);
            const originalPrice = item.original_price
              ? typeof item.original_price === "number"
                ? item.original_price
                : Number(item.original_price)
              : finalPrice;
            const discountPercent = item.discount_percent
              ? typeof item.discount_percent === "number"
                ? item.discount_percent
                : Number(item.discount_percent)
              : 0;

            const lineTotal = finalPrice * item.quantity;
            const hasDiscount =
              discountPercent > 0 && originalPrice > finalPrice;

            return (
              <li
                key={item.item_id}
                className="list-group-item d-flex justify-content-between"
              >
                <div>
                  <span>
                    {item.item.item_name} x {item.quantity}
                  </span>
                  {hasDiscount && (
                    <div className="text-muted small">
                      <span style={{ textDecoration: "line-through" }}>
                        ₱{originalPrice.toFixed(2)} each
                      </span>{" "}
                      <span className="text-success">
                        {discountPercent}% off - ₱{finalPrice.toFixed(2)} each
                      </span>
                    </div>
                  )}
                </div>
                <span>₱{lineTotal.toFixed(2)}</span>
              </li>
            );
          })}
          <li className="list-group-item d-flex justify-content-between">
            <strong>Total:</strong>
            <strong>₱{total.toFixed(2)}</strong>
          </li>
        </ul>
      </div>
      <div>Thank you for your purchase, {fullname}!</div>

      {isLoading && (
        <div className="alert alert-info mt-3">Processing your receipt...</div>
      )}

      {error && <div className="alert alert-warning mt-3">{error}</div>}

      {hasUploaded && !error && (
        <div className="alert alert-success mt-3">
          Receipt processed successfully!
        </div>
      )}
    </div>
  );
};

export default Receipt;
