import React, { ReactElement } from "react";
import { Metadata } from "next";
import { CustomHeader } from "@/src/components/common/header";
import { FcMoneyTransfer, FcDeployment, FcPhotoReel } from "react-icons/fc";
import Link from "next/link";
import "./style.scss";

export const metadata: Metadata = {
  title: "Vehicle Status",
  description: "Verify Vehicle Status",
};

interface AccountsProps {
  link: string;
  title: string;
  desc: string;
  icon: ReactElement;
}

const items: AccountsProps[] = [
  {
    link: "vehicle-status/license-vehicle-status",
    title: "License & Vehicle Status",
    desc: "Confirm License & Vehicle Status",
    icon: <FcDeployment className="icon" />,
  },
  {
    link: "vehicle-status/vehicle-enumeration-status",
    title: "Vehicle Enumeration Status",
    desc: "Confirm Vehicle Enumeration Status",
    icon: <FcPhotoReel className="icon" />,
  },

];

const UserAccountPage = () => {
  return (
    <div className="vehicle-stats">
      <CustomHeader title="Verify Vehicle Status" desc={"Select an option"} />

      <div className="vehicle-stats_container">

        <div className="vehicle-stats_items">
          {items.map((item) => (
            <Link
              href={`/${item.link}`}
              key={item.link}
              className={`vehicle-stats_item`}
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
      </div>
    </div>
  );
};

export default UserAccountPage;
