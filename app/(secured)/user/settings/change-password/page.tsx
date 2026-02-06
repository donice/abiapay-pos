import { CustomHeader } from "@/src/components/common/header";
import ChangePasswordComponent from "@/src/components/modules/user/settings/change-password";
import { Metadata } from "next/types";
import React from "react";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Reset Password for agent's account",
};

const ChangePasswordPage = () => {
  return (
    <div>
      <CustomHeader title="Change Password" desc="Reset agents password" />
      <ChangePasswordComponent />
    </div>
  );
};

export default ChangePasswordPage;
