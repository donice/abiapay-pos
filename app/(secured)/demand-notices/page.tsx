import React from 'react'
import type { Metadata } from "next";
import DemandNoticesComponent from '@/src/components/modules/demand-notices';

export const metadata: Metadata = {
  title: "Transport Tickets - Agent Portal",
  description: "Agents Portal Tickets Page",
};


const DemandNoticesPage = () => {
  return (
    <div>
      <DemandNoticesComponent />
    </div>
  )
}

export default DemandNoticesPage;