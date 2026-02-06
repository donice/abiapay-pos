import CreateInfantAbssinModule from '@/src/components/modules/identity/create/infant';
import { Metadata } from 'next/types';
import React from 'react'

export const metadata: Metadata = {
  title: "Dependent ABSSIN",
  description: "Create Individual ABSSIN for Infant",
};

const CreateInfantAbssinPage = () => {
  return (
    <div><CreateInfantAbssinModule /></div>
  )
}

export default CreateInfantAbssinPage