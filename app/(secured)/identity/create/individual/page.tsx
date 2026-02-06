import CreateIndividualAbssinComponent from '@/src/components/modules/identity/create/individual'
import { Metadata } from 'next/types';
import React from 'react'

export const metadata: Metadata = {
  title: "Individual ABSSIN",
  description: "Create Individual ABSSIN for Individual",
};

const CreateIndividualAbssinPage = () => {
  return (
    <div><CreateIndividualAbssinComponent /></div>
  )
}

export default CreateIndividualAbssinPage