"use client";
import { CustomHeader } from "@/src/components/common/header";
import React, { useRef, useState } from "react";
import BulkPrintForm from "./form";
import BulkComp from "./bulk";
import { Button } from "@/src/components/common/button";

const PrintIDComp = () => {
  const [viewData, setViewData] = useState("form");
  const [bulkData, setBulkData] = useState<[] | null>(null);

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
             .bulk-id {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            @media (max-width: 768px) {
              .bulk-id {
                grid-template-columns: repeat(1, minmax(0, 1fr));
              }
            }

          .bulk-id .card {
            margin-top: 2rem;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            position: relative;
            gap: 1rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            padding: 1rem;
            border-radius: 0.5rem;
            width: 32rem;
            height: 19.5rem;
            border: 2px solid rgb(240, 240, 240);
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            background-image: url("/prints/Abia-idbg.png");
          }

          .id-card {
            position: relative;
            display: flex;
            gap: 2.75rem;
            width: 500px;
            height: 315px;
            padding: 10px;
            background: #fff;
            background: url("/prints/Abia-idbg.png") no-repeat center center;
            background-size: cover;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            margin-bottom: 2rem;

            .left-section {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;

              .profile-img {
                width: 150px;
                border-radius: 1rem;
                height: 180px;
                overflow: hidden;

                img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                }
              }

              .enumeration-id {
                font-family: 'Courier New', Courier, monospace;
                font-weight: 700;
                letter-spacing: 0.075rem;
              }

              .enum-row {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;
                align-items: center;
                margin-top: 0.5rem;
              
                p {
                  margin: 0;
                  line-height: 1;
                }
              }
            }

            .right-section {
              .personal-details {
              display: flex !important;
              flex-direction: column !important;
              gap: 2rem !important;
              margin-top: 6.5rem !important;
              font-weight: 600 !important;
          }


              .profile-img {
                width: 100px;
                height: auto;
                border: 2px solid #fff;
              }
            }
          }
          .product-tag {
            position: absolute;
            right: 2.5rem;
            top: 9rem;
            font-weight: 700;
            color: #fff;
          }

          .qr-code {
            position: absolute;
            right: 0.95rem;
            bottom: 3.5rem;
            width: 100px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
      

          .abssin_span {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            bottom: 1.45rem;
            right: 0.75rem;

            p {
              margin: 0;
              line-height: 1.1;
            }

            .abssin_number {
              font-weight: bold;
              font-family: 'Courier New', Courier, monospace;
              font-weight: 800;
              letter-spacing: 0.075rem;
            }
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
      <CustomHeader title="Bulk ID Cards" desc="Print bulk ID cards" />
      {viewData == "form" ? (
        <BulkPrintForm setViewData={setViewData} setBulkData={setBulkData} />
      ) : viewData == "data" ? (
        <div className="print-top">
          <Button text={"Print IDs"} onClick={handlePrint} />
          <div ref={printRef} style={{ marginTop: "2rem" }}>
            <BulkComp bulkData={bulkData} />
          </div>
        </div>
      ): null}
    </div>
  );             
 };

export default PrintIDComp;
