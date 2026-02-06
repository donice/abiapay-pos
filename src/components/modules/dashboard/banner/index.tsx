import React from "react";
import { AbiaLogoWhite } from "@/src/components/common/Images";
import Image from "next/image";
import GoogleDownloadImage from "./assets/google_play.png";
import "./style.scss";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const DashboardBanner = () => {
  return (
    <div className="dashboard-banner">
      <div className="dashboard-banner_content">
        <div>
          <span className="dashboard-banner_content_logo">
            <AbiaLogoWhite />
          </span>
          <h1>
            Abiapay is better on <span> the mobile app</span>
          </h1>
          <p>Download Now</p>
        </div>
        <a
          href="https://play.google.com/store/search?q=abiapay&c=apps&hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="dashboard-banner_content_download"
        >
         <span className="desktop">Download Here👇</span> 
         <span className="mobile">Download <MdOutlineArrowForwardIos /></span> 
          <Image src={GoogleDownloadImage} alt="google play" />
        </a>
      </div>
    </div>
  );
};

export default DashboardBanner;
