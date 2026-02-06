"use client";
import React from "react";
import { SecondaryButton } from "@/src/components/common/button";
import { CustomHeader } from "@/src/components/common/header";
import "../../../style.scss";
import AllEmblemModule from "@/src/components/modules/tickets/transport/emblem/all";


const TransportTicketComponent = () => {
  return (
    <div className="transport">
      <header className="transport_header">
        <CustomHeader
          title="Emblem Management"
          desc="View and Manage Transport Emblems"
        />
        <div className="transport_header_buttons">
          <SecondaryButton text="Create New Emblem" link="/tickets/transport/emblem" />
        </div>
      </header>

      <div className="transport_table mt-4">
        <AllEmblemModule />
      </div>
    </div>
  );
};

export default TransportTicketComponent;
