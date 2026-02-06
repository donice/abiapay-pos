"use client";
import React from "react";
import { fetchCollectionData, fetchDashboardData } from "@/src/services/dashboardService";
import { useQuery } from "@tanstack/react-query";
import { TicketsWalletCard } from "../../dashboard/walletCard";
import { State } from "@/src/components/types/dashboardTypes";
import "./style.scss";
import LoaderSkeleton from "@/src/components/common/loader-skeleton";


const TicketsWalletCards = () => {
  const { data } = useQuery({
    queryKey: ["get_dashboard_data"],
    queryFn: () => {
      return fetchDashboardData();
    },
  });

  const { data: ticketData, isLoading, isError } = useQuery({
    queryKey: ["ticketsWalletData"],
    queryFn: fetchCollectionData,
  });

  console.log(ticketData)
  
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
  

  return (
    <div className="ticketspage_wallet">
      <TicketsWalletCard
        bank={"access"}
        data={{
          total_credit: undefined,
          total_debit: data?.ledger_balance,
          balance: undefined,
          earnings: undefined,
          account_name: data?.access.wallet_name,
          account_number: data?.access?.wallet_id,
          bank_name: "access",
          current_earnings: data?.access?.current_earnings,
          wallet_balance: data?.access?.wallet_balance,
          wallet_id: data?.access?.wallet_id,
          wallet_name: data?.access?.wallet_name,

          this_month_count: ticketData?.data[0]?.total_transaction_monthly,
          this_month_amount: ticketData?.data[0]?.total_amount_monthly,
          this_week_count: ticketData?.data[0]?.total_transaction_weekly,
          this_week_amount: ticketData?.data[0]?.total_amount_weekly
        }}
      />
      <TicketsWalletCard
        bank={"fidelity"}
        data={{
          total_credit: undefined,
          total_debit: data?.ledger_balance,
          balance: data?.fidelity?.balance,
          earnings: data?.fidelity?.earnings,
          account_name: data?.fidelity.wallet_name,
          account_number: data?.fidelity?.account_number,
          bank_name: "fidelity",
          current_earnings: data?.fidelity?.earnings,
          wallet_balance: data?.fidelity?.balance,
          wallet_id: data?.fidelity?.account_number,
          wallet_name: data?.fidelity?.account_name,

          this_month_count: ticketData?.data[0]?.total_transaction_monthly,
          this_month_amount: ticketData?.data[0]?.total_amount_monthly,
          this_week_count: ticketData?.data[0]?.total_transaction_weekly,
          this_week_amount: ticketData?.data[0]?.total_amount_weekly
        }}
      />
    </div>
  );
};

export default TicketsWalletCards;
