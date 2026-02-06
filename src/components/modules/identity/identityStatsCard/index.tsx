"use client";
import React from "react";
import "./style.scss";
import { useQuery } from "@tanstack/react-query";
import LoaderSkeleton from "@/src/components/common/loader-skeleton";
import { fetchABSSINStats } from "@/src/services/identityService";


const IdentityStatsCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticketsWalletData"],
    queryFn: fetchABSSINStats,
  });

  console.log(data, "data");

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

  console.log(data, "data");

  return (
    <>
      {data ? (
        <figure className="identity-stats">
          <div className="identity-stats-card">
            <div className="ticket_container grid grid-cols-3 gap-2">
              <div className="grid grid-cols-1">
                <span>Total ABSSINs (Today)</span>
                <span className="text-white text-xl font-semibold">
                  {(data &&
                    data?.response_data?.tp_indv?.thisDay) ||
                    "0"}{" "}
                  ABSSIN
                  {data?.response_data?.tp_indv?.thisDay >
                  1
                    ? "s"
                    : ""}{" "}

                </span>
              </div>
              <div className="grid grid-cols-1">
                <span>Total ABSSINs (This Week)</span>
                <span className="text-white text-xl font-semibold">
                  {(data &&
                    data?.response_data?.tp_indv?.thisWeek) ||
                    "0"}{" "}
                  ABSSIN
                  {data?.response_data?.tp_indv?.thisWeek >
                  1
                    ? "s"
                    : ""}{" "}

                </span>
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

export default IdentityStatsCard;
