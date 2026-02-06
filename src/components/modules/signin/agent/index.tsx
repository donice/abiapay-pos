"use client";

import React, { useEffect } from "react";
import { CustomFormHeader } from "../../../common/header";
import "./style.scss";
import { logout, useAuthDispatch } from "@/src/context/authContext";
import AgentSigninForm from "./form";

const AgentsSigninComponent = () => {
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
      <CustomFormHeader title="Agent Sign in" desc="Sign in to your agents portal" />
      <AgentSigninForm />
      {/* <p>Are you an agent? <a onClick={handleLogout}>Sign out</a></p> */}
    </div>
  );
};

export default AgentsSigninComponent;
