"use client";
import React from "react";
import { Button } from "@/src/components/common/button";
import "./style.scss";
import { useQuery } from "@tanstack/react-query";
import { CustomHeader } from "@/src/components/common/header";
import { fetchAccountStatement } from "@/src/services/accountServices";
import { fetchDashboardData } from "@/src/services/dashboardService";
import { Loading } from "@/src/components/common/loader/redirecting";
import { formatAmount } from "@/src/utils/formatAmount";
import { useRouter } from "next/navigation";

const Dynamic = () => {
  const router = useRouter();
    const { data: statementData, isPending: isStatementPending } = useQuery({
      queryKey: ["my-statement"],
      queryFn: fetchAccountStatement,
    });

    const { data: dashboardData, isPending: isDashboardPending } = useQuery({
      queryKey: ["dashboard-data"],
      queryFn: fetchDashboardData,  // Assuming this fetches the dashboard data
    });

    if (isStatementPending || isDashboardPending) {
      return <Loading />;
    }

  const accessEarnings = dashboardData?.access?.current_earnings || 0;
  const fidelityEarnings = dashboardData?.fidelity?.earnings || 0;
  const totalEarnings = accessEarnings + fidelityEarnings;
  return (
    <>
      {" "}
      <CustomHeader
        title={"Account Statement"}
        desc={"Account Statement Details"}
      />
      {isStatementPending || isDashboardPending ? (
        <Loading />
      ) : (
        <div className="statement">
          <div className="statement_comp">
            <div>
              <p>Full name</p>
              <p>{statementData?.data?.fullname || "-"}</p>
            </div>

            <div>
              <p>User Category</p>
              <p>{statementData?.data?.user_cat || "-"}</p>
            </div>

            <div>
              <p>Agent Code</p>
              <p>{statementData?.data?.agent_code || "-"} </p>
            </div>

            <div>
              <p>Email</p>
              <p>{statementData?.data?.email || "-"} </p>
            </div>

            <div>
              <p>L.G.A</p>
              <p>{statementData?.data?.lga || "-"} </p>
            </div>

            <div>
              <p>Account Status</p>
              <p>{statementData?.data?.account_status || "-"} </p>
            </div>
            <div>
              <p>Pending Transactions</p>
              <p>
                ₦{formatAmount(statementData?.data?.pending_transactions) || "-"} /{" "}
                {statementData?.data?.pending_transactions_count || "0"}{" "}
              </p>
            </div>
            <div>
              <p>Total Transactions</p>
              <p>
                ₦{formatAmount(statementData?.data?.total_transactions) || "-"} /{" "}
                {statementData?.data?.total_transactions_count || "0"}{" "}
              </p>
            </div>
            <div>
              <p>Total Transactions Today</p>
              <p>
                ₦{formatAmount(statementData?.data?.total_transactions_today) || "-"} /{" "}
                {statementData?.data?.total_transactions_today_count || "0"}{" "}
              </p>
            </div>
            <div>
              <p>Wallet Balance</p>
              <p>₦{formatAmount(statementData?.data?.wallet_balance) || "-"} </p>
            </div>
            <div>
              <p>Total Wallet Credit </p>
              <p>₦{formatAmount(statementData?.data?.total_wallet_credit) || "-"} </p>
            </div>
            <div>
              <p>Access Earnings </p>
              <p>₦{formatAmount(dashboardData?.access?.current_earnings) || "-"} </p>
            </div>
            <div>
              <p>Fidelity Earnings </p>
              <p>₦{formatAmount(dashboardData?.fidelity?.earnings) || "-"} </p>
            </div>
            <div>
              <p>Total Earnings</p>
              <p>₦{formatAmount(totalEarnings) || "-"} </p>
            </div>
            <div className="creation_date">
              <p>Creation Date </p>
              <p> {statementData?.data?.creation_date || "-"}</p>
            </div>
          </div>

          <div className="statement_cta">
            <div className="statement_cta_info">
              <p>
                Payout requests will be activated when your current earnings are
                N100, and above
              </p>
            </div>
            <Button
            // disabled={true}
              text={"Fidelity Cashout"}
              onClick={() => {
                router.push("/account/statement/fidelity");
              }}
            />
            <Button
              text={"Access Cashout"}
              onClick={() => {
                router.push("/account/statement/access");
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Dynamic;
