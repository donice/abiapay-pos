import React from 'react'
import { Metadata } from 'next';
import AddManifestComp from '@/src/components/modules/tickets/transport/manifest';

export const metadata: Metadata = {
  title: "Create Transport Ticket",
  description: "Agents Portal Tickets Page",
};


const AddManifestPage = () => {
  return (
    <div>
      <AddManifestComp/>
    </div>
  )
}

export default AddManifestPage;