"use client";
import React, { useState } from "react";
import VehicleData from "./vehicleData";
import OwnerData from "./ownerData";
import DriverData from "./driverData";
import "./style.scss";
import ProgressBar from "./progressBar";

const TransportEnumerationComponent = () => {
  const [stage, setStage] = useState(0);
  const [details, setDetails] = useState({});
  const [formData, setFormData] = useState({});

  console.log(formData);

  return (
    <section>
      <ProgressBar stage={stage} setStage={setStage}/>
     
      {stage === 0 && <VehicleData setStage={setStage} setDetails={setDetails} formData={formData} setFormData={setFormData}/>}
      {stage === 1 && <OwnerData setStage={setStage} details={details} formData={formData}/>}
      {stage === 2 && <DriverData setStage={setStage} details={details} formData={formData}/>}
    </section>
  );
};

export default TransportEnumerationComponent;
