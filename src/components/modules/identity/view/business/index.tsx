import { LargeLoader } from '@/src/components/common/loader';
import { getBusinessABSSINs } from '@/src/services/identityService';
import { useQuery } from 'react-query';
import React from 'react'
import BusinessAbssinStatsCard from './BusinessAbssinStatsCard';
import ViewAllBusinessABSSIN from './ViewAllBusinessABSSIN';


const ViewBusinessAbssinComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["ticketsWalletData"],
    queryFn: getBusinessABSSINs,
  });
  return isLoading ? (
    <div>
      <LargeLoader />
    </div>
  ) : (
    <div className="grid gap-4">
      <BusinessAbssinStatsCard data={data} />
      <ViewAllBusinessABSSIN data={data} />
    </div>
  );
}

export default ViewBusinessAbssinComponent