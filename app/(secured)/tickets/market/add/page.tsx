import React from 'react'
import { Metadata } from 'next';
import AddMarketTicketComponent from '@/src/components/modules/tickets/market/addMarketTicket';

export const metadata: Metadata = {
  title: "Create Market Levy",
  description: "Agents Portal Tickets Page",
};


const AddMarketTicketPage = () => {
  return (
    <div>
      <AddMarketTicketComponent/>
    </div>
  )
}

export default AddMarketTicketPage;