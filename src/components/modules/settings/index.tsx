"use client";
import React, { ReactElement, useEffect, useState } from "react";
import {
  FcUnlock,
  FcLibrary,
  FcOrgUnit,
  FcKey,
  FcCurrencyExchange,
  FcButtingIn,
  FcCapacitor,
  FcCollaboration,
  FcCallback,
  FcInfo,
  FcMoneyTransfer,
  FcExport,
} from "react-icons/fc";
import Link from "next/link";
import "./style.scss";
import { isBrowser } from "@/src/utils/isBrowser";

interface WalletItemsProps {
  href: string;
  title: string;
  desc?: string;
  icon: ReactElement;
  cat?: string;
}

const walletItems: WalletItemsProps[] = [
  {
    href: "/wallet/transfer/earnings-to-wallet",
    title: "Earnings To Wallet",
    icon: <FcMoneyTransfer className="icon" />,
    cat: "wallet",
  },
  {
    href: "/wallet/transfer/other-wallet",
    title: "To Other Wallets",
    icon: <FcOrgUnit className="icon" />,
    cat: "wallet",
  },
  {
    href: "/wallet/transfer/bank",
    title: "To Bank",
    icon: <FcLibrary className="icon" />,
    cat: "wallet",
  },
];

const dailyServices: WalletItemsProps[] = [
  {
    href: "/airtime",
    title: "Airtime",
    icon: <FcCallback className="icon" />,
    // cat: "coming soon",
  },
  {
    href: "/data",
    title: "Data",
    icon: <FcCollaboration className="icon" />,
    // cat: "coming soon",
  },
  {
    href: "/services/loan",
    title: "Loan",
    icon: <FcCurrencyExchange className="icon" />,
    cat: "coming soon",
  },
  {
    href: "/services/electicity",
    title: "Electicity",
    icon: <FcCapacitor className="icon" />,
    cat: "coming soon",
  },
];

const otherServices: WalletItemsProps[] = [
  {
    href: "/user/settings/about",
    title: "About",
    icon: <FcInfo className="icon" />,
  },
  {
    href: "/user/settings/change-password",
    title: "Change Password",
    icon: <FcKey className="icon" />,
  },
  {
    href: "/user/settings/support",
    title: "Support",
    icon: <FcButtingIn className="icon" />,
  },
  {
    href: "/signin",
    title: "Logout",
    icon: <FcExport className="icon" />,
  },
];

const UserSettingsComponent = () => {
  const [userData, setUserData] = useState<{
    name?: string;
    phone?: string;
  } | null>(null);

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("USER_DATA");
      if (data) {
        try {
          setUserData(JSON.parse(data));
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData({});
        }
      }
    }
  }, []);

  return (
    <div className="settings">
      {/* <CustomHeader
        title="Extras"
        desc={"Explore all extra services available for you"}
      /> */}
      <div className="userdata">
        <h1>{userData?.name}</h1>
        <p>
          Number: <span>{userData?.phone}</span>
        </p>
      </div>
      <h2>My Wallet Transfer</h2>
      <div className="settings_items">
        {walletItems.map((item) => (
          <Link
            href={`${
              item.cat === "coming soon" ? "/user/settings" : item.href
            }`}
            key={item.href}
            className={`settings_item`}
          >
            <div>
              {" "}
              <span>{item.icon}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="settings_banner">
        <div>
          <em>STAY CONNECTED</em>
          <p>Don’t ever run out of Airtime and Data</p>
        </div>
      </div>

      <h2>Daily Services</h2>
      <div className="settings_items_service">
        {dailyServices.map((item) => (
          <Link
            href={`${
              item.cat === "coming soon" ? "/user/settings" : item.href
            }`}
            key={item.href}
            className={`settings_item`}
          >
            {item.cat === "coming soon" && <span className="soon">soon</span>}
            <div>
              {" "}
              <span>{item.icon}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <h2>Other Services</h2>
      <div className="settings_items_service">
        {otherServices.map((item) => (
          <Link
            href={`${item.href}`}
            key={item.href}
            className={`settings_item`}
          >
            <div>
              {" "}
              <span className="icon">{item.icon}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserSettingsComponent;
