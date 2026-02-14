"use client";
import React, { useState, useMemo } from "react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useQuery } from "react-query";
import { Loading } from "@/src/components/common/loader/redirecting";
import "../../transportTable/style.scss";
import Empty from "@/src/components/common/empty";
import { formatAmount } from "@/src/utils/formatAmount";
import { useRouter } from "next/navigation";
import { GoVerified } from "react-icons/go";
import { fetchAllEmblem } from "@/src/services/ticketsServices";
import { TbLoader } from "react-icons/tb";
import { LuListRestart } from "react-icons/lu";

const AllEmblemModule: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["get_all_emblems"],
    queryFn: () => {
      return fetchAllEmblem();
    },
  });

  const fetched_data = data?.response_data || [];

  const filteredTransactions = useMemo(() => {
    if (!debouncedSearchTerm) return fetched_data;

    const filtered = fetched_data.filter((transaction: any) =>
      transaction?.trans_ref
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      console.log("No results found for:", debouncedSearchTerm);
    }

    return filtered;
  }, [debouncedSearchTerm, fetched_data]);

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

  // console.log("Filtered Transactions:", filteredTransactions);

  return (
    <section className="main-table">
      {isLoading ? (
        <div className={"loading"}>
          <Loading />
        </div>
      ) : (
        <>
          {" "}
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
              placeholder="Search by Vehicle Plate Number"
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
                    key={transaction.payment_ref}
                    className="ticket"
                    onClick={() =>
                      router.push(
                        `/tickets/transport/emblem/summary?payment_ref=${transaction.payment_ref}`
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
                          <GoVerified />
                        ) : (
                          <TbLoader />
                        )}
                        {transaction.status}
                      </p>

                      <p className="next_date">
                        <span>
                          <LuListRestart className="icon" />
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
            <Empty text="No emblems found" />
          )}
        </>
      )}
    </section>
  );
};

export default AllEmblemModule;
