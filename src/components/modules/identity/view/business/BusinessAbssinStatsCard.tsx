import React from 'react'
import "./style.scss";

const BusinessAbssinStatsCard = ({data}:any) => {
    console.log(data, "busness data");
  return (
    <div className="identity-stats">
    <h2>Total Business ABSSINs</h2>
    <p>{data?.data?.length} <span className="sub-text">Business ABSSINs created</span></p>
  </div>
  )
}

export default BusinessAbssinStatsCard