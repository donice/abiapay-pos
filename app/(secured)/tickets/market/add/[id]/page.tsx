import React from "react";
import { Metadata } from "next";
import MarketTicketDetailsComponent from "@/src/components/modules/tickets/market/details";

export const metadata: Metadata = {
  title: "Create Market Ticket",
  description: "Agents Portal Tickets Page",
};

const MarketTicketDetailsPage = ({ params }: { params: { id: string } }) => {
  const id =  params.id;
  return (
    <div>
      <MarketTicketDetailsComponent id={id} />
    </div>
  );
};

export default MarketTicketDetailsPage;
