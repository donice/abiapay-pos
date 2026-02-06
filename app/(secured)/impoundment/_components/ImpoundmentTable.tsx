"use client";
import React, { useState, useMemo } from "react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/src/components/common/loader/redirecting";
import "./style.scss";
import Empty from "@/src/components/common/empty";
import { formatAmount } from "@/src/utils/formatAmount";
import { useRouter } from "next/navigation";
import { TbSearch } from "react-icons/tb";
import axiosInstance from "@/src/lib/axiosInstance";

const ImpoundmentTable: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["get_impoundments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/impoundment/impoundment-offenses");
      return res?.data;
    },
  });

  const fetched_data = data?.response_data || [];
  console.log(fetched_data);

  const filteredTransactions = useMemo(() => {
    if (!debouncedSearchTerm) return fetched_data;

    const filtered = fetched_data.filter((transaction: any) =>
      transaction?.offense_category
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      return <Empty text="No tickets found" />;
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
          <TbSearch />
        </label>
        <input
          type="text"
          placeholder="Search by Offense Category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search input outline-none"
        />
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="main-table_form_tickets_container">
          <div className="tickets">
            {filteredTransactions.map((transaction: any) => (
              <div
                key={transaction.idagent_transactions}
                className="border border-teal-500 bg-teal-50/50 rounded-md p-4 my-2 grid grid-cols-2"
                onClick={() =>
                  router.push(
                    `/tickets/transport/${transaction.idagent_transactions}`
                  )
                }
              >
                <div>
                  <p className="block">
                    <span className="text-[10px] text-gray-500 uppercase ">
                      Offence Category
                    </span>
                    <span className="block font-bold">
                      {transaction.offense_category}
                    </span>{" "}
                  </p>
                </div>
                <div className="flex  flex-col items-end">
                  <p className="text-green-600 font-bold">
                    ₦{formatAmount(transaction.penalty_amount)}
                  </p>
                  <p>{transaction.vehicle_type}</p>
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

export default ImpoundmentTable;
