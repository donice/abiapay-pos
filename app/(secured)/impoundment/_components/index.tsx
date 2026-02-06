"use client"

import React from "react";
import { CustomHeader } from "@/src/components/common/header";
import "./style.scss";
import ImpoundmentTable from "./ImpoundmentTable";
import { PrimaryButton } from "@/src/components/common/button";
import { useRouter } from "next/navigation";

const VehicleImpoundmentComponent = () => {
  const router = useRouter();

  return (
    <div className="impoundment">
      <header className="impoundment_header">
        <CustomHeader
          title="Vehicle Impoundment"
          desc="Manage/Create Vehicle Impoundment Ticket"
        />
        <div className="impoundment_header_buttons">
          <PrimaryButton text="Add Impoundment Ticket" link={"/impoundment/add"} />
        </div>
      </header>

      <div className="impoundment_table">
        <ImpoundmentTable />
      </div>
    </div>
  );
};

export default VehicleImpoundmentComponent;
