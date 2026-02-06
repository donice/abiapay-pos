import React from "react";
import "./style.scss";
import { AbiaLogoLarge } from "../../common/Images";
import { getCurrentYear } from "@/src/utils/getCurrentYear";

const UnsecuredPagesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (

    <div className="unsecured-main">
      <a href="/dashboard" className="logo" aria-label="Abiapay Agents Logo">
        <AbiaLogoLarge />
      </a>
      <div className="unsecured-main_container">{children}</div>
      <footer >
      © {getCurrentYear()} Abia State Government. <br /> All rights reserved.
      </footer>
    </div>
  );
}

export default UnsecuredPagesLayout;
