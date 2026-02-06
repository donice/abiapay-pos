"use client";

import React from "react";
import IndividualABSSINStatsCard from "./IndividualABSSINStatsCard";
import { useQuery } from "@tanstack/react-query";
import { getIndividualABSSINs } from "@/src/services/identityService";
import ViewAllIndividualABSSIN from "./ViewAllIndividualABSSIN";
import LargeLoader from "@/src/components/common/loader";

const ViewIndividualAbssinComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["ticketsWalletData"],
    queryFn: getIndividualABSSINs,
  });

  return isLoading ? (
    <div>
      <LargeLoader />
    </div>
  ) : (
    <div className="grid gap-4">
      <IndividualABSSINStatsCard data={data} />
      <ViewAllIndividualABSSIN data={data} />
    </div>
  );
};

export default ViewIndividualAbssinComponent;
