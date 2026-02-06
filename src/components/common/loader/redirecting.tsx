"use client"
import React from "react";
import { LargeLoader } from "../loader";
import "./style.scss";

const Redirecting = () => {
  return (
    <section className="redirecting">
      <div className="redirecting_container">
        <LargeLoader />
        <p>Redirecting...</p>
      </div>
    </section>
  );
};
export const Loading = () => {
  return (
    <section className="loading">
      <div className="loading_container">
        <LargeLoader />
        <p>Loading data...</p>
      </div>
    </section>
  );
};

export default Redirecting;
