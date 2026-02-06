import React from "react";
import TicketsWalletCard from "../ticketsStatsCard";
import { CustomHeader } from "@/src/components/common/header";
import "./style.scss";
import TransactionsTable from "./transportEnumerationTable";


const ViewTransportEnumerationComponent = () => {
  return (
    <div className="transport">
      <header className="transport_header">
        <CustomHeader
          title="Completed Enumerations"
          desc="View all completed Enumerations"
        />
      </header>
      {/* <TicketsWalletCard /> */}

      <div className="transport_table">
        <TransactionsTable />
      </div>
    </div>
  );
};

export default ViewTransportEnumerationComponent;
