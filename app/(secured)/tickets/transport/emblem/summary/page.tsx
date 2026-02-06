import { Metadata } from 'next';
import React from 'react'
import EmblemSummary from '@/src/components/modules/tickets/emblemSummary';

export const metadata: Metadata = {
  title: "View Payment Summary",
  description: "Agents Portal Tickets Page",
};

const EmblemSummaryPage = () => {
  return (
    <div>
      <EmblemSummary/>
    </div>
  )
}

export default EmblemSummaryPage;