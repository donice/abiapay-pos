"use client";
import React, { useState } from "react";
import ShopkeepersDetails from "./shopkeepersDetails";
import "./style.scss";
import ProgressBar from "./progressBar";
import EnumerationDetails from "./enumerationDetails";
import { CustomHeader } from "@/src/components/common/header";

const MarketEnumerationComponent = () => {
  const [stage, setStage] = useState(0);
  const [formData, setFormData] = useState({});

  console.log(formData);

  return (
    <section className="enumeration">
      <CustomHeader title={"Market Enumeration"} desc={"Enumerate Shops in the market"} />
      <ProgressBar stage={stage} setStage={setStage}/>
     
      {stage === 0 && <EnumerationDetails setStage={setStage} formData={formData} setFormData={setFormData}/>}
      {stage === 1 && <ShopkeepersDetails setStage={setStage} formData={formData}/>}
    </section>
  );
};

export default MarketEnumerationComponent;
