"use client";
import React, { useState, useMemo } from "react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useQuery } from "react-query";
import { Loading } from "@/src/components/common/loader/redirecting";
import "./style.scss";
import Empty from "@/src/components/common/empty";
import { formatAmount } from "@/src/utils/formatAmount";
import { useRouter } from "next/navigation";
import { GoVerified } from "react-icons/go";
import { fetchTransactions } from "@/src/services/ticketsServices";
import { TbLoader, TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { LuListRestart } from "react-icons/lu";
import { MdOutlineRestartAlt } from "react-icons/md";

const TransactionsTable: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["get_transactions"],
    queryFn: () => {
      return fetchTransactions();
    },
  });

  const fetched_data = data?.data || [];

  const filteredTransactions = useMemo(() => {
    if (!debouncedSearchTerm) return fetched_data;

    const filtered = fetched_data.filter((transaction: any) =>
      transaction?.trans_ref
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      console.log("No results found for:", debouncedSearchTerm);
      // console.log("Fetched Data:", fetched_data);
    }

    return filtered;
  }, [debouncedSearchTerm, fetched_data]);

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
      <div className="filter-input">
        <label htmlFor="search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#3ba361"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </label>
        <input
          type="text"
          placeholder="Search by Plate Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search input"
        />
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="main-table_form_tickets_container">
          <div className="tickets">
            {filteredTransactions.map((transaction: any) => (
              <div
                key={transaction.idagent_transactions}
                className="ticket"
                onClick={() =>
                  router.push(
                    `/tickets/transport/${transaction.idagent_transactions}`
                  )
                }
              >
                <div>
                  <p>{transaction.trans_ref}</p>
                  <p>{transaction.revenue_item}</p>
                  <p>{new Date(transaction.createtime).toLocaleString()}</p>
                  <p>Ref: {transaction.payment_ref}</p>
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
                      <TbRosetteDiscountCheckFilled />
                    ) : (
                      <TbLoader />
                    )}
                    {transaction.status}
                  </p>

                  <p className="next_date">
                    <span>
                      <MdOutlineRestartAlt className="icon" />
                    </span>
                    <span>
                      {" "}
                      {new Date(transaction.next_date).toLocaleString()}
                    </span>
                  </p>
                  <p>Valid for: {transaction.payment_period}</p>
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
