import MarketTicketsSummaryComponent from '@/src/components/modules/tickets/market/marketTicketSummary';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "View Payment Summary",
  description: "Agents Portal Tickets Page",
};

const MarketTicketsSummaryPage = () => {
  return (
    <div>
      <MarketTicketsSummaryComponent/>
    </div>
  )
}

export default MarketTicketsSummaryPage;