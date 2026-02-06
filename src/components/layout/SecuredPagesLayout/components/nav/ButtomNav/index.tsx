"use client";
import React, { ReactElement, useEffect, useState } from "react";
import "./style.scss";
import Link from "next/link";
import useGetRoute from "@/src/hooks/useGetRoute";
import {
  TbHome,
  TbHomeFilled,
  TbSquareRoundedPlusFilled,
  TbSquareRoundedPlus,
  TbLineScan,
  TbUserFilled,
  TbUser,
  TbLayoutGridAdd,
  TbLayoutGridFilled,
  TbZoomScanFilled,
  TbTicket,
} from "react-icons/tb";
import { useRouter } from "next/navigation";
import { isBrowser } from "@/src/utils/isBrowser";

interface BottomNavProps {
  name: string;
  title: string;
  icon: ReactElement;
  icon_active?: ReactElement;
  access?: "Agent" | "Enforcers" | "MdaUser";
}

const nav_items: BottomNavProps[] = [
  {
    name: "dashboard",
    title: "Home",
    icon: <TbHome className="icon" />,
    icon_active: <TbHomeFilled className="icon" />,
  },
  // {
  //   name: "tickets/transport",
  //   title: "Transport",
  //   icon: <TbTicket className="icon" />,
  //   icon_active: <HiTicket className="icon" />,
  // },
  {
    name: "tickets/verify",
    title: "Verify Tickets",
    icon: <TbLineScan className="icon" />,
    icon_active: <TbZoomScanFilled className="icon" />,
    access: "Agent",
  },
  {
    name: "tickets/add",
    title: "Add Tickets",
    icon: <TbSquareRoundedPlus className="icon plus" />,
    icon_active: <TbSquareRoundedPlusFilled className="icon plus" />,
    access: "Agent",
  },
  {
    name: "user/account",
    title: "My Account",
    icon: <TbUser className="icon" />,
    icon_active: <TbUserFilled className="icon" />,
    access: "Agent",
  },
  {
    name: "user/settings",
    title: "Extras",
    icon: <TbLayoutGridAdd className="icon" />,
    icon_active: <TbLayoutGridFilled className="icon" />,
  },
];

const BottomNav = () => {
  const route = useGetRoute();
  const router = useRouter();

  const [userData, setUserData] = useState<{
    name?: string;
    user_cat?: string;
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
    <div className="bottom-nav">
      <div className="bottom-nav_items_container">
        <div className="bottom-nav_items">
          {nav_items
            // .filter((item) => item.access == userData?.user_cat)
            .map((item) => (
              <Link
                href={`/${item.name}`}
                key={item.name}
                className={`bottom-nav_item ${item.name === route ? "active" : "inactive"
                  }`}
              >
                <span>
                  {item.name === route ? item.icon_active : item.icon}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
