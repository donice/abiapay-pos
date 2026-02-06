import MarketEnumerationComponent from '@/src/components/modules/enumeration/market';
import type { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Market Enumeration",
  description: "Enumerate Shops",
};


const MarketEnumerationPage = () => {
  return (
    <div><MarketEnumerationComponent /></div>
  )
}

export default MarketEnumerationPage