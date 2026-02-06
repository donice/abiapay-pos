import React from "react";
import "./style.scss";

const IndividualABSSINStatsCard = ({ data }: any) => {
  console.log(data, "data");

  return (
    <div className="identity-stats">
      <h2>Total Individual ABSSINs</h2>
      <p>{data?.data?.length} <span className="sub-text">ABSSINs created</span></p>
    </div>
  );
};

export default IndividualABSSINStatsCard;
