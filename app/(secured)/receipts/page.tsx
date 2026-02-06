import React from 'react'
import type { Metadata } from "next";
import ReceiptsComponent from '@/src/components/modules/tickets/receipts';

export const metadata: Metadata = {
  title: "Transport Tickets - Agent Portal",
  description: "Agents Portal Tickets Page",
};


const BillsPage = () => {
  return (
    <div>
      <ReceiptsComponent />
    </div>
  )
}

export default BillsPage;