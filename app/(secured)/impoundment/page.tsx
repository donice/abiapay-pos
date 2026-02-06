import React from 'react'
import type { Metadata } from "next";
import VehicleImpoundmentComponent from './_components';

export const metadata: Metadata = {
  title: "Vehicle Impoundment - Agent Portal",
  description: "Agents Portal Vehicle Impoundment Tickets Page",
};

const VehicleImpoundmentPage = () => {
  return (
    <div>
      <VehicleImpoundmentComponent />
    </div>
  );
};

export default VehicleImpoundmentPage;
