"use client";
import React, { useEffect, useState } from "react";
import { CustomHeader } from "@/src/components/common/header";
import "./style.scss";
import {
  DefaultButton,
  CancelButton,
  GoBackButton,
} from "@/src/components/common/button";
import Redirecting from "@/src/components/common/loader/redirecting";
import { isBrowser } from "@/src/utils/isBrowser";
import { CamelCaseToTitleCase } from "@/src/utils/helper";

const MarketTicketsSummaryComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = isBrowser && sessionStorage.getItem("TRANSPORT_FORM_DETAILS");
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    }
  }, []);

  return (
    <section className="market">
      <GoBackButton />

      <div className="market-summary-comp">
        <div className="market-summary-comp_header">
          <CustomHeader
            title="Transport Ticket Details"
            desc="Comfirm the details for your Transport Ticket Purchase"
          />
        </div>

        <div className="market-summary-comp_container">
          {data ? (
            <div>
              {Object.entries(data).map(
                ([key, value]: [key: any, value: any]) => (
                  <div key={key} className="line-items">
                    <p>{CamelCaseToTitleCase(key)}:</p>
                    <p>{value}</p>
                  </div>
                )
              )}
            </div>
          ) : (
              <Redirecting />
          )}
        </div>
        <div className="btn_container">
          <CancelButton link="/market/transport" />
          <DefaultButton text="Proceed to Payment" link="/" />
        </div>
      </div>
    </section>
  );
};

export default MarketTicketsSummaryComponent;
