import React from "react";
import "./style.scss"

interface props {
  title: string,
  desc: string
}

export const CustomHeader = ({title, desc}: props) => {
  return (
    <div className="custom-header">
      <h1>{title}</h1>
      <p>{desc}</p>
    </div>
  );
};

export const CustomFormHeader = ({title, desc}: props) => {
  return (
    <div className="custom-form-header">
      <h1>{title}</h1>
      <p>{desc}</p>
    </div>
  );
};

