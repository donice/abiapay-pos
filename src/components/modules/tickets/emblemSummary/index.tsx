"use client";
import React, { useEffect, useRef, useState } from "react";
import { CustomFormHeader } from "@/src/components/common/header";
import "./style.scss";
import {
  Button,
  GoBackButton,
  PrimaryButton,
} from "@/src/components/common/button";
import { Loading } from "@/src/components/common/loader/redirecting";
import { CamelCaseToTitleCase } from "@/src/utils/helper";
import { formatAmount } from "@/src/utils/formatAmount";
import { AbiaStateLogo } from "@/src/components/common/Images";
import { useReactToPrint } from "react-to-print";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { fetchSingleEmblem } from "@/src/services/ticketsServices";
import Empty from "@/src/components/common/empty";

const EmblemSummary: React.FC = () => {
  const params = useSearchParams();
  const pay_ref = params.get("payment_ref");

  const componentRef = useRef<HTMLDivElement>(null);

  const {data, isLoading} = useQuery({
    queryKey: ["emblemSummary", pay_ref],
    queryFn: () => {
      return fetchSingleEmblem(pay_ref as string);
    },
  });

  console.log(data?.response_data[0]);


  const displayKeys = [
    "trans_date",
    "trans_ref",
    "rev_head",
    "rev_code",
    "payment_ref",
    "payment_period",
    "trans_channel",
    "status",
    "trans_type",
    "lga",
    "vehicle_type",
    "vehicle_content",
    "taxpayer_name",
    "taxpayer_email",
    "taxpayer_phone",
    "revenue_item",
    "payment_method",
    "plate_number",
    "payment_date",
    // "taxoffice"
  ];

  const amount = data?.amount;

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `receipt_$`,
    // documentTitle: `receipt_${res?.invoice_id}`,
  });

  return (
    <section className="tickets">
      <GoBackButton />

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
          {isLoading ? <Loading /> : data ? (
            <>
              {" "}
              <div
                key={"amount"}
                className="tickets-summary-comp_container_amount"
              >
                <p>{formatAmount(data?.response_data[0]?.amount)}</p>
              </div>
              <div>
                {Object.entries(data?.response_data[0])
                  .filter(([key]) => displayKeys.includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="line-items">
                      <p>{CamelCaseToTitleCase(key)}:</p>
                      <p className="text-right">
                        {key === "wallet_type"
                          ? CamelCaseToTitleCase(value as string)
                          : String(value)}
                      </p>
                    </div>
                  ))}
              </div>{" "}
              <div className="btn_container">
                <PrimaryButton
                  text="View Certificate"
                  link={`/tickets/transport/emblem/${data?.response_data[0]?.plate_number}?payment_ref=${pay_ref}`}
                />
                <Button text="Share Receipt" onClick={handlePrint} />
              </div>
            </>
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </section>
  );
};

export default EmblemSummary;
