import { RotatingLines } from "react-loader-spinner";
import "./style.scss"

import React from "react";

const Loader = () => {
  return (
    <div className="loader-div">
      <RotatingLines
        visible={true}
        width="22"
        strokeColor="white"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export const SmallLoader= () => {
  return (
    <div className="loader-div">
      <RotatingLines
        visible={true}
        width="15"
        strokeColor="black"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export const LargeLoader= () => {
  return (
    <div className="loader-div">
      <RotatingLines
        visible={true}
        width="50"
        strokeColor="green"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default Loader;
