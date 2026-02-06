import React from 'react'
import AddTransportTicketComponent from '@/src/components/modules/tickets/transport/addTransportTicket'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create Transport Ticket",
  description: "Agents Portal Tickets Page",
};


const AddTransportTicketPage = () => {
  return (
    <div>
      <AddTransportTicketComponent/>
    </div>
  )
}

export default AddTransportTicketPage;