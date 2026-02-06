import FlyingRevenueComponent from "@/src/components/modules/tickets/transport/flying-revenue";
import React from "react";

const FlyingRevenuePage = ({ params }: { params: { slug: string } }) => {
  
  return (
    <div>
      <FlyingRevenueComponent slug={params.slug}/>
    </div>
  );
};

export default FlyingRevenuePage;
