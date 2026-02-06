"use client";
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loading } from "@/src/components/common/loader/redirecting";
import "./style.scss";
import Empty from "@/src/components/common/empty";
import { formatAmount } from "@/src/utils/formatAmount";
import { useRouter } from "next/navigation";
import { GoVerified } from "react-icons/go";
import { TbLoader } from "react-icons/tb";
import { fetchBills } from "@/src/services/billServices";
const TransactionsTable: React.FC = () => {
  const router = useRouter();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["get_bills"],
    queryFn: () => {
      return fetchBills();
    },
  });

  const fetched_data = data?.response_data || [];

  if (isLoading) {
    return (
      <div className={"loading"}>
        <Loading />
      </div>
    );
  }

  if (isError) {
    console.log(data);
  }

  if (!data || data.length === 0) {
    return (
      <div className={"empty"}>
        <Empty />
      </div>
    );
  }

  return (
    <section className="main-table">
      {fetched_data.length > 0 ? (
        <div className="main-table_form_tickets_container">
          <div className="tickets">
            {fetched_data.map((transaction: any, index: any) => (
              <div
                key={index}
                className="ticket"
                onClick={() =>
                  router.push(
                    `/bills/${transaction.transref}`
                  )
                }
              >
                <div>
                  <p>Taxpayer ID:{transaction.taxpayer}</p>
                  <p>{transaction.rev_item}</p>
                  <p>{transaction.mda}</p>
                  <p>Ref: {transaction.transref}</p>
                </div>
                <div>
                  <p>₦{formatAmount(transaction.amount)}</p>
                  <p
                    className={`${
                      transaction.status === "Completed"
                        ? "completed"
                        : "pending"
                    }`}
                  >
                    {transaction.status === "Completed" ? (
                      <GoVerified />
                    ) : (
                      <TbLoader />
                    )}
                    {transaction.status}
                  </p>

                  <p className="next_date">
                  
                    <span>
                      {" "}
                      {transaction.occurrence}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Empty text="No tickets found" />
      )}
    </section>
  );
};

export default TransactionsTable;
