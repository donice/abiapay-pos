import { CustomHeader } from "@/src/components/common/header";
import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import QRCode from "react-qr-code";

import abiaLogo from "@/public/logos/emblem/abia_@33.jpg";
import coaLogo from "@/public/logos/emblem/coat_of_arm.png";
import jtb from "@/public/logos/emblem/jtb.png";
import { isBrowser } from "@/src/utils/isBrowser";
import { Button } from "@/src/components/common/button";
import html2canvas from "html2canvas"
import { useMutation } from "react-query";
import axiosInstance from "@/src/lib/axiosInstance";

const ViewTransportEmblemReceipt = ({
  plate_no,
  payment_ref,
}: {
  plate_no: string;
  payment_ref: string;
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [data, setUserData] = useState({
    product_code: "",
  });

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("TRANSPORT_INVOICE");
      if (data) {
        try {
          setUserData(JSON.parse(data));
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData({
            product_code: "",
          });
        }
      }
    }
  }, []);

  const handleDownload = async () => {
    if (componentRef.current) {
      try {
        const canvas = await html2canvas(componentRef.current, {
          scale: 2,
          windowWidth: componentRef.current.scrollWidth,
          useCORS: true,
          allowTaint: true,
        });

        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`emblem-receipt-${payment_ref}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  return (
    <div>
      <CustomHeader
        title={"Emblem Receipt"}
        desc="View Transport Emblem Receipt"
      />
      <section
        className={style.emblem}
        id="tickets-summary-comp"
        ref={componentRef}
      >
        <div className={style.emblem_receipt}>
          <header className={style.emblem_receipt_header}>
            <div className={style.emblem_receipt_header_logos}>
              <img src={abiaLogo.src} alt="obia" width={100} height={100} />
              <img src={coaLogo.src} alt="coa" width={100} height={100} />
              <img src={jtb.src} alt="jtb" width={100} height={100} />
            </div>
            <div className={style.emblem_receipt_header_title}>
              <h1>ABIA STATE GOVERNMENT</h1>
              <h2>2025 CONSOLIDATED EMBLEM</h2>
              <h2>for {data?.product_code} </h2>
            </div>
            <div className={style.emblem_receipt_header_reference}>
              <p>Plate Number: <br/> {plate_no}</p> <p>Payment Ref:<br/> {payment_ref}</p>
            </div>
          </header>


          <div className={style.emblem_receipt_clearance}>
            <header className={style.emblem_receipt_clearance_header}>
              CLEARANCE CERTIFICATE
            </header>
            <ul className={style.emblem_receipt_clearance_list}>
                <li>1. Board of Internal Revenue (Hackney Carriage)</li>
                <li>2. Sanitation Sticker/Pollution/Effluent Discharge/Emission Control</li>
                <li>3. MOT Sticker</li>
                <li>4. Haulage Permit</li>
                <li>5. Safety Emblem</li>
                <li>6. National Freight</li>
                <li>7. Commodity Sticker</li>
                <li>8. Loading and Off Loading</li>
                <li>9. Route/Inter State/Road Tax Warrant Permit</li>
                <li>10. Ogepa Sticker</li>
                <li>11. Agric Levy</li>
                <li>12. Federal Ocean Terminal</li>
                <li>13. Airport</li>
                <li>14. Mid-Year Sticker</li>
                <li>15. ASPIMSS Yearly Safety Clearance Delivery Permit</li>
                <li>16. Heavy Duty Permit</li>
                <li>17. Intra State and Inter State Route Permit</li>
                <li>18. Mobile Advert</li>
                <li>19. Radio TV License</li>
                <li>20. Oil and Gas Permit</li>
                <li>21. Sale and Distribution Permit</li>
                <li>22. Unified Local Government permit</li>
                <li>23. Niger Delta Sticker</li>
                <li>24. Federal Organ Terminal for Trailers, Lorries, Pickup, Buses and Cars</li>
                <li>25. Other Permit Covered by National Emblem</li>
            </ul>
          </div>

          <div className={style.emblem_receipt_footer}>
            <p className={style.emblem_receipt_footer_text}>
              This is to certify that the vehicle with this sticker has
              satisfied every lawful road permit with respect to the above
              listed items and should be allowed free passage and hence
              protected from any road abuse, touting, illegal block, unlawful
              delay, harassment by any other State Agent Nationwide.
            </p>

            <div className={style.emblem_receipt_footer_signature}>
              <p>Executive Chairman</p>
              <p>Abia State Internal Revenue Service</p>
            </div>

            <div className={style.qr_container}>
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={`https://abiapay.com//verify/emblem?=${payment_ref}`}
                viewBox={`0 0 256 256`}
              />


            </div>
            <div className="hidden text-[6px] md:text-xs. md:block">
              <p>Scan the above url to verify, or visit:</p> <p className="underline">{`https://abiapay.com//verify/emblem?=${payment_ref}`}</p>
            </div>

          </div>
        </div>
      </section>
      <Button
        text="Download Certificate"
        // onClick={() => handleDownloadPDF()}
        onClick={handleDownload}
        />
    </div>
  );
};

export default ViewTransportEmblemReceipt;
