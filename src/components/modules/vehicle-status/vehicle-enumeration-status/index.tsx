"use client";
import { GoBackButton } from "@/src/components/common/button";
import { CustomHeader } from "@/src/components/common/header";
import Form from "./form";
import React, { useState } from "react";
import { formatAmount } from "@/src/utils/formatAmount";
import { CamelCaseToTitleCase } from "@/src/utils/helper";
import { GoVerified } from "react-icons/go";
import { RiLoaderLine } from "react-icons/ri";
import Empty from "@/src/components/common/empty";
import { useRouter } from "next/navigation";
import "../style.scss";

const VehicleEnumerationStatusComponent = () => {
  const router = useRouter();
  const [ticketsData, setTicketsData] = useState([]);
  const [searched, setSearched] = useState(false);

  if (ticketsData) {
    sessionStorage.setItem("TICKETS_DATA", JSON.stringify(ticketsData));
  }

  return (
    <section className="find">
      <GoBackButton />

      <div className="find-comp">
        <header>
          <CustomHeader
            title="Verify Enumeration Status"
            desc="Enter taxpayer plate number to verify"
          />
        </header>

        <div className="find-comp_form">
          <Form setTicketsData={setTicketsData} setSearched={setSearched} />

          {ticketsData && ticketsData.length > 0 ? (
            <div className="find-comp_form_tickets_container">
              <div className="tickets">
                {ticketsData.map((transaction: any, index: number) => (
                  <div
                    key={index}
                    className="ticket"
                    onClick={() =>
                      router.push(
                        `/vehicle-status/vehicle-enumeration-status/${transaction.PlateNumber}`
                      )
                    }
                  >
                    <div>
                      <p style={{ textTransform: "uppercase" }}>
                        {transaction.PlateNumber}
                      </p>
                      <p>{transaction.TaxpayerName}</p>
                      <p>ABSSIN: {transaction.TaxpayerID}</p>
                      <p>Enumeration ID: {transaction.EnumerationID}</p>
                      <p>Rev Year: {transaction.RevenueYear}</p>
                      <p>{transaction.phone}</p>
                    </div>
                    <div>
                      
                      <p>{transaction.IncomeCategory}</p><p>{transaction.RevenueItem}</p>
                      <p>N{formatAmount(transaction.EnumerationFee)}</p><p
                        className={`${
                          transaction.Status == "PAID"
                            ? "completed"
                            : "processing"
                        }`}
                      >
                        {transaction.Status == "PAID" ? (
                          <GoVerified />
                        ) : (
                          <RiLoaderLine />
                        )}
                        {transaction.Status}
                      </p>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searched ? (
            <Empty text="No Plate Number Found" />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default VehicleEnumerationStatusComponent;
