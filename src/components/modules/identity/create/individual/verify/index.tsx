"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import EnterDetailsComponent from "./enterDetails";
import ValidateOtpComponent from "./validateOtp";
import { getLastPathSegment } from "@/src/utils/getLastPathSegment";

const VerifyComponent = () => {
  const pathname = usePathname();
  const path = getLastPathSegment(pathname);

  return (
    <div>
      {path == "verify" ? <EnterDetailsComponent /> : <ValidateOtpComponent />}
    </div>
  );
};

export default VerifyComponent;
