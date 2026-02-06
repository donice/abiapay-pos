import React from 'react'
import { Metadata } from 'next';
import FirsPartySignageComponent from '@/src/components/modules/absaa/signage/first-party';

export const metadata: Metadata = {
  title: "First Part Signage",
  description: "Create first party signage",
};


const FirstPartySignagePage = () => {
  return (
    <div>
      <FirsPartySignageComponent/>
    </div>
  )
}

export default FirstPartySignagePage;