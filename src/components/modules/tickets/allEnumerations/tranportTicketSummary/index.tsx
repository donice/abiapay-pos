"use client";
import React, { useEffect, useRef, useState } from "react";
import { CustomFormHeader } from "@/src/components/common/header";
import "./style.scss";
import {
  Button,
  GoBackButton,
  SecondaryButton,
} from "@/src/components/common/button";
import { Loading } from "@/src/components/common/loader/redirecting";
import { CamelCaseToTitleCase } from "@/src/utils/helper";
import { formatAmount } from "@/src/utils/formatAmount";
import { AbiaStateLogo } from "@/src/components/common/Images";
import { useReactToPrint } from "react-to-print";

interface TicketData {
  [key: string]: any;
}

const TransportTicketsSummaryComponent: React.FC = () => {
  const [data, setData] = useState<TicketData | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("TRANSPORT_INVOICE");
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    }
  }, []);

  const displayKeys = [
    "transaction_date",
    "invoice_id",
    "paymentPeriod",
    "agentEmail",
    "plateNumber",
    "taxPayerPhone",
    "taxPayerName",
    "wallet_type",
  ];

  const amount = data?.amount;

  // Function to handle printing the receipt
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `receipt_${data?.invoice_id}`,
  });

  return (
    <section className="tickets">
      <GoBackButton />

      {data ? (
        <div id="tickets-summary-comp" className="tickets-summary-comp">
          <div
            style={{ width: "100%", maxWidth: "500px" }}
            ref={componentRef}
            className="tickets-summary-comp_container"
          >
            <div className="tickets-summary-comp_container_logo">
              <AbiaStateLogo />
              <CustomFormHeader
                title="Transaction Receipt"
                desc="View the details for your Purchased Ticket"
              />
            </div>
            <div
              key={"amount"}
              className="tickets-summary-comp_container_amount"
            >
              <p>{formatAmount(amount)}</p>
            </div>

            <div>
              {Object.entries(data)
                .filter(([key]) => displayKeys.includes(key))
                .map(([key, value]) => (
                  <div key={key} className="line-items">
                    <p>{CamelCaseToTitleCase(key)}:</p>
                    <p>
                      {key === "wallet_type"
                        ? CamelCaseToTitleCase(value)
                        : value}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <div className="btn_container">
            <SecondaryButton
              text="Create New"
              link={"/tickets/transport/add"}
            />
            <Button text="Share Receipt" onClick={handlePrint} />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </section>
  );
};

export default TransportTicketsSummaryComponent;
