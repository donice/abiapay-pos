import AgentsSigninComponent from '@/src/components/modules/signin/agent';
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: "Sigin to Agents Portal",
  description: "Abia Pay for Agents Portal Dashboard",
};

const AgentSignInPage = () => {
  return (
    <div>
      <AgentsSigninComponent />
    </div>
  )
}

export default AgentSignInPage