import ChangePasswordComponent from "@/src/components/modules/user/settings/change-password";
import { Metadata } from "next/types";
import React from "react";
import "./style.scss";
import { CustomFormHeader, CustomHeader } from "@/src/components/common/header";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Reset Password for agent's account",
};

const ForgotPasswordPage = () => {
  return (
    <div>
      <CustomFormHeader title="Forgot Password" desc="Reset password for agent's account" />
      <div className="forgot-password">
        <ChangePasswordComponent />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
