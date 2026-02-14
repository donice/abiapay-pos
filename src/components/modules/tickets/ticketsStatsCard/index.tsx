"use client";
import React from "react";
import "./style.scss";
import { fetchCollectionData } from "@/src/services/dashboardService";
import { useQuery } from "react-query";
import LoaderSkeleton from "@/src/components/common/loader-skeleton";
import { formatAmount } from "@/src/utils/formatAmount";

const TicketsStatsCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticketsWalletData"],
    queryFn: fetchCollectionData,
  });

  if (isLoading) {
    return (
      <div>
        <LoaderSkeleton height="100px" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Error</p>
      </div>
    );
  }

  // console.log(data.data, "Data");

  return (
    <>
      {data ? (
        <figure className="tickets-wallet">
          <div className="tickets-wallet-card">
            <div className="ticket_container">
              <div className="tickets-wallet-card_balance">
                <span>Today&apos;s Collections</span>
                <span>₦{formatAmount(data.data?.[0].total_amount)}</span>
              </div>

              <div className="tickets-wallet-card_image"></div>

              <div className="tickets-wallet-card_balance">
              <span>{new Date().toDateString()}</span>

                <span>{data.data?.[0].total_transaction} Tickets</span>
              </div>
            </div>
          </div>
          <div className="tickets-wallet-card">
            <div className="ticket_container">
              <div className="tickets-wallet-card_balance">
                <span>Week&apos;s Collections</span>
                <span>
                  ₦{formatAmount(data.data?.[0].total_amount_weekly)}
                </span>
              </div>

              <div className="tickets-wallet-card_image"></div>

              <div className="tickets-wallet-card_balance">
                <span>Month&apos;s Collection</span>
                <span>{data.data?.[0].total_transaction_weekly} Tickets</span>
              </div>
            </div>
          </div>
        </figure>
      ) : (
        <LoaderSkeleton height="200px" />
      )}
    </>
  );
};

export default TicketsStatsCard;
