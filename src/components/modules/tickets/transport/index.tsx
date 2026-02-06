import React from "react";
import TicketsWalletCard from "../ticketsStatsCard";
import { SecondaryButton } from "@/src/components/common/button";
import { CustomHeader } from "@/src/components/common/header";
import "./style.scss";
import TransactionsTable from "./transportTable";


const TransportTicketComponent = () => {
  return (
    <div className="transport">
      <header className="transport_header">
        <CustomHeader
          title="Transport Ticket"
          desc="Manage/Create Transport Ticket"
        />
        <div className="transport_header_buttons">
          <SecondaryButton text="Add Ticket" link="/tickets/transport/add" />
        </div>
      </header>
      <TicketsWalletCard />

      <div className="transport_table">
        <TransactionsTable />
      </div>
    </div>
  );
};

export default TransportTicketComponent;
