"use client";
import React from "react";
import "./style.scss";
import { fetchEnumerationData } from "@/src/services/dashboardService";
import { useQuery } from "@tanstack/react-query";
// import Loading from "@/app/(secured)/loading";
import LoaderSkeleton from "@/src/components/common/loader-skeleton";

const EnumerationStatsCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["enumerationStatsData"],
    queryFn: fetchEnumerationData,
  });

  if (isLoading) {
    return (
      <div className={"loading"}>
        {/* <Loading /> */}
        <div>Loading...</div>
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
    <>
      {data ? (
        <figure className="identity-stats">
          <div className="identity-stats-card">
            <div className="ticket_container">
              <div className="identity-stats-card_balance">
                <span>Today&apos;s Enumeration</span>
                <span>{(data?.response_data?.transport?.thisDay + data?.response_data?.market?.thisDay) || 0}</span>
              </div>

              <div className="identity-stats-card_image"></div>

              <div className="identity-stats-card_balance">
                <span>This Month&apos;s Enumeration</span>
                <span>{(data?.response_data?.transport?.thisMonth + data?.response_data?.market?.thisMonth) || 0}</span>
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

export default EnumerationStatsCard;
