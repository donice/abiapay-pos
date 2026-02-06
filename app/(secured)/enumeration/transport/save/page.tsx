import SaveVehicleDetailsComponent from "@/src/components/modules/enumeration/transport/saveVehicleDetails";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Save Vehicle Details",
  description: "Enumerate Vehicles",
};

const SaveVehicleDetailsPage = () => {
  return (
    <div>
      <SaveVehicleDetailsComponent />
    </div>
  );
};

export default SaveVehicleDetailsPage;
