import VerifyComponent from '@/src/components/modules/identity/create/individual/verify'
import { Metadata } from 'next/types';
import React from 'react'
import { GoBackButton } from '@/src/components/common/button';

export const metadata: Metadata = {
  title: "Create ABSSIN",
  description: "Create ABSSIN",
};

const VerifyPage = () => {
  return (
    <>
    <GoBackButton />
    <div><VerifyComponent /></div>
    </>
  )
}

export default VerifyPage