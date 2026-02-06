"use client";
import { CustomHeader } from "@/src/components/common/header";
import React, { useState, useRef } from "react";
import BulkPrintForm from "./form";
import BulkComp from "./bulk";
import { Button } from "@/src/components/common/button";

const PrintIDComp = () => {
  const [viewData, setViewData] = useState("form");
  const [bulkData, setBulkData] = useState<[] | null>(null);
  const [stickerLga, setStickerLga] = useState();

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;

      const printWindow = window.open("", "", "width=900,height=600");

      if (printWindow) {
        printWindow.document.write(`
          <html>
          <head>
            <title>Print Stickers</title>
            <style>
              @media print {
                .bulk-print-item {
                  page-break-after: always;
                  counter-increment: bulk-item;
                }
                .bulk-print-item:nth-child(3n) {
                  page-break-after: always;
                }
              }

              /* Grid Layout for Stickers */
              .bulk-sticker {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }

              @media (max-width: 768px) {
                .bulk-sticker {
                  grid-template-columns: repeat(1, minmax(0, 1fr));
                }
              }

              .bulk-sticker .card {
                margin-top: 2rem;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                position: relative;
                gap: 1rem;
                background-image: url("/prints/sticker_bg.JPG");
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                padding: 1rem;
                border-radius: 0.5rem;
                width: 32rem;
                height: 32rem;
                border: 2px solid #c6c6c6;
              }

              .bulk-sticker .card-tag {
                position: absolute;
                top: 4.5rem;
                right: 1.5rem;
                font-weight: 700;
                color: red;
                font-size: 1.25rem;
                padding: 0.5rem;
              }

              .bulk-sticker .card-plate_no {
                position: absolute;
                top: 9.2rem;
                left: 50%;
                transform: translateX(-50%);
                font-weight: 600;
                font-family: Tahoma;
                font-size: 2.25rem;
                padding: 0.5rem;
                text-transform: uppercase;
                color: gray;
              }

              .bulk-sticker .card-asset_code {
                 position: absolute;
                left: 50%;
                transform: translateX(-50%);
                font-weight: 800;
                font-size: 2.75rem;
                padding: 1.5rem;
                text-transform: uppercase;
                color: green;
                top: 430px;
              }

              .bulk-sticker .card-lga {
                position: absolute;
                 top: .5rem;
                 left: 1.1rem;
                color: gray;
                font-size: 0.75rem;
                padding: 0.5rem;
                text-transform: uppercase;
                color:green;
              }

              .bulk-sticker .card-cat,
              .bulk-sticker .card-income {
                position: absolute;
                transform: rotate(90deg);
                top: 50%;
                font-weight: 600;
                font-size: 1rem;
                letter-spacing: 0.25rem;
                padding: 1.5rem;
                text-transform: uppercase;
                color: red;
              }

              .bulk-sticker .card-cat {
                left: -2rem;
              }
              .bulk-sticker .card-income {
                right: -2rem;
              }

              .bulk-sticker .card-enum {
                position: absolute;
                font-weight: 600;
                bottom: 6.5rem;
                font-size: 1rem;
                padding: 1.5rem;
                text-transform: uppercase;
                color: gray;
                letter-spacing: 0.3rem;
              }


              .bulk-sticker .card-content {
                gap: 1rem;
                display: grid;
                grid-template-columns: repeat(5, minmax(0, 1fr));
              }

              .bulk-sticker .card-content .qrcode {
                position: absolute;
                top: 37%;
                left: 50%;
                transform: translateX(-50%);
              }
            </style>
          </head>
          <body>${printContents}</body>
          </html>
        `);
        printWindow.document.close();

        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };
      } else {
        console.error("Failed to open the print window.");
      }
    } else {
      console.error("printRef is null.");
    }
  };

  return (
    <div>
      <CustomHeader title="Bulk Stickers" desc="Print stickers" />
      {viewData == "form" ? (
        <BulkPrintForm setViewData={setViewData} setBulkData={setBulkData} setStickerLga={setStickerLga} />
      ) : viewData == "data" ? (
        <div className="print-top">
          <Button text={"Print Stickers"} onClick={handlePrint} />
          <div ref={printRef}>
            <BulkComp bulkData={bulkData} stickerLga={stickerLga} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PrintIDComp;
