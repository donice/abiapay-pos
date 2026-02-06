import React from 'react'
import type { Metadata } from "next";
import TransportTicketComponent from '@/src/components/modules/tickets/transport';

export const metadata: Metadata = {
  title: "Transport Tickets - Agent Portal",
  description: "Agents Portal Tickets Page",
};


const TransportTicketsPage = () => {
  return (
    <div>
      <TransportTicketComponent />
    </div>
  )
}

export default TransportTicketsPage;