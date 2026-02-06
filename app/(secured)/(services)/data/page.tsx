import DataModule from '@/src/components/modules/(services)/data';
import { Metadata } from 'next/types';
import React from 'react'

export const metadata: Metadata = {
  title: "Get Data - Agents Portal",
  description: "Purchase Data Using The AbiaPay App",
};

const DataPage = () => {
  return (
    <div>
      <DataModule />
    </div>
  )
}

export default DataPage