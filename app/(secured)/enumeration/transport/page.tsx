import TransportEnumerationComponent from '@/src/components/modules/enumeration/transport';
import type { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Transport Enumeration",
  description: "Enumerate Vehicles",
};


const TransportEnumerationPage = () => {
  return (
    <div><TransportEnumerationComponent /></div>
  )
}

export default TransportEnumerationPage