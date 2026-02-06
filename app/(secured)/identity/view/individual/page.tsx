import ViewIndividualAbssinComponent from '@/src/components/modules/identity/view/individual'
import { Metadata } from 'next/types';
import React from 'react'

export const metadata: Metadata = {
  title: "All Individual ABSSINs",
  description: "Manage all Identities tied to your ABIAPAY account",
};

const ViewIndividualAbssinPage = () => {
  return (
    <div>
      <ViewIndividualAbssinComponent/>
    </div>
  )
}

export default ViewIndividualAbssinPage