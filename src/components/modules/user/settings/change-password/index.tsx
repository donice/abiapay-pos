"use client";
import { CustomHeader } from "@/src/components/common/header";
import React, { useState } from "react";
import "./style.scss";
import ProgressBar from "./progressBar";
import ConfirmEmail from "./confirmEmail";
import ValidateOTP from "./validateOTP";
import ChangePassword from "./changePassword";

// This component is being called in the forgot-password page and the change-password page
const ChangePasswordComponent = () => {
  const [stage, setStage] = useState(0);
  const [formData, setFormData] = useState({});

  console.log(formData);

  return (
    <div className="password">

      <ProgressBar stage={stage} setStage={setStage} />

      {stage === 0 && <ConfirmEmail setStage={setStage} setFormData={setFormData}/>}
      {stage === 1 && <ValidateOTP setStage={setStage} setFormData={setFormData} formData={formData}/>}
      {stage === 2 && <ChangePassword setStage={setStage} setFormData={setFormData} formData={formData}/>}
      
    </div>
  );
};

export default ChangePasswordComponent;
