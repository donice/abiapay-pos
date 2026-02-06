import React from "react";

const ProgressBar = ({ stage, setStage }: any) => {
  const getProgressWidth = () => {
    return `${(stage + 1) * 25}%`;
  };
  return (
    <div className="progress">
      <div className="progress-container">
        <div className="progress-line">
          <div
            className="progress-bar"
            style={{ width: getProgressWidth() }}
          ></div>
          <div
            className={`progress-label ${stage >= 0 ? "active" : ""}`}
            style={{ left: "10%" }}
          >
            Basic
          </div>
          <div
            className={`progress-label ${stage >= 1 ? "active" : ""}`}
            style={{ left: "35%" }}
          >
            Business
          </div>
          <div
            className={`progress-label ${stage >= 2 ? "active" : ""}`}
            style={{ left: "60%" }}
          >
            Address
          </div>
          <div
            className={`progress-label ${stage >= 3 ? "active" : ""}`}
            style={{ left: "85%" }}
          >
            Summary
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default ProgressBar;
