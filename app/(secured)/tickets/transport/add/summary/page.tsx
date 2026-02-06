import { Metadata } from 'next';
import React from 'react'
import TransportTicketsSummaryComponent from '@/src/components/modules/tickets/transport/tranportTicketSummary';

export const metadata: Metadata = {
  title: "View Payment Summary",
  description: "Agents Portal Tickets Page",
};

const TransportTicketsSummaryPage = () => {
  return (
    <div>
      <TransportTicketsSummaryComponent/>
    </div>
  )
}

export default TransportTicketsSummaryPage;