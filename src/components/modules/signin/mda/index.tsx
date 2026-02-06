"use client";

import React, { useEffect } from "react";
import { CustomFormHeader } from "../../../common/header";
import "./style.scss";
import { logout, useAuthDispatch } from "@/src/context/authContext";
import MDASigninForm from "./form";

const MDASigninComponent = () => {
  const dispatch = useAuthDispatch();
  useEffect(() => {
    handleLogout()
    sessionStorage.clear();
  }, []);

  const handleLogout = () => {
    logout(dispatch);
  };

  return (
    <div className="sigin_component">
      <CustomFormHeader title="MDA Sign in" desc="Sign in to your agents portal" />
      <MDASigninForm />
    </div>
  );
};

export default MDASigninComponent;
