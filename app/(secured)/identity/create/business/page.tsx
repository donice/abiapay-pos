import BusinessIndividualAbssinComponent from '@/src/components/modules/identity/create/business';
import { Metadata } from 'next/types';
import React from 'react'

export const metadata: Metadata = {
  title: "Business ABSSIN",
  description: "Create Business ABSSIN for Business",
};

const BusinessIndividualAbssinPage = () => {
  return (
    <div><BusinessIndividualAbssinComponent /></div>
  )
}

export default BusinessIndividualAbssinPage