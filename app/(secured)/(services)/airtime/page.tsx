import AirtimeModule from '@/src/components/modules/(services)/airtime';
import { Metadata } from 'next/types';
import React from 'react'

export const metadata: Metadata = {
  title: "Get Airtime - Agents Portal",
  description: "Purchase Airtime Using The AbiaPay App",
};

const AirtimePage = () => {
  return (
    <div>
      <AirtimeModule />
    </div>
  )
}

export default AirtimePage