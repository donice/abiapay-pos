import Image from "next/image";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { QRCodeSVG } from "qrcode.react";

const BulkComp = ({ bulkData }: any) => {
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    if (bulkData) {
      console.log(bulkData);
      setDisplayData(bulkData);
    }
  }, [bulkData]);

  if (!bulkData) {
    return null;
  }

  return (
    <div className="bulk-id">
      {displayData?.map((data: any, idx: number) => (
        <div className="id-card" key={idx}>
          <div className="left-section">
            <div className="profile-img">
              <img src={data?.PhotoID} alt="Profile" />
            </div>

            <div className="enum-row">
            <p className="label">ENUM-ID</p>
            <p className="enumeration-id">{data?.EnumerationID}</p>
          </div>
          </div>
          <div className="right-section">
            <div className="personal-details">
              <div className="detail">
                <span className="value">{data?.surname || "-"}</span>
              </div>
              <div className="detail">
                <span className="value">{data?.first_name || "-"}</span>
              </div>
              <div className="detail">
                <span className="value">{data?.Park || "-"}</span>
              </div>
              <div className="detail">
                <span className="value">{data?.phone_number || "-"}</span>
              </div>
            </div>
          </div>{" "}


          
          <div className="qr-code ">
            <QRCodeSVG
              style={{ width: 80, height: 100 }}
              className="qrcode"
              value={`https://abiapay.com/verify-asset?assetCode=${data?.assetCode}&enum=${data?.EnumerationID}`}
            />
          </div>
          <div className="abssin_span">
          <p className="abssin_text">ABSSIN</p>
          <p className="abssin_number"> {data?.state_id}</p>
          </div>

        </div>
      ))}
    </div>
  );
};

export default BulkComp;
