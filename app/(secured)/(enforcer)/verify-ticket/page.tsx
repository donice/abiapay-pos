

import { CustomHeader } from '@/src/components/common/header';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { FcDisclaimer, FcSearch, FcTimeline } from 'react-icons/fc';
import VeifyTicketStatusComponent from '@/src/components/modules/verify-ticket-status';
import { GoBackButton } from '@/src/components/common/button';

interface TicketFinesProps {
      link: string;
      title: string;
      icon: ReactElement;
}

const VerifyTicket = () => {
  return (
   <>
   <GoBackButton/>
    <VeifyTicketStatusComponent />
   </>
  )
}

export default VerifyTicket