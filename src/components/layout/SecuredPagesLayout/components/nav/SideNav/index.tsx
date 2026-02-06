"use client";
import React, { ReactElement, useEffect, useState } from "react";
import "./style.scss";
import Link from "next/link";
import useGetRoute from "@/src/hooks/useGetRoute";
import {
  TbHome,
  TbTicket,
  TbLogout2,
  TbLineScan,
  TbUser,
  TbSquareRoundedPlus,
  TbLayoutGridAdd,
} from "react-icons/tb";
import { isBrowser } from "@/src/utils/isBrowser";

// Define the allowed user categories
type UserCategory = "Agent" | "Enforcer" | "MdaUser";

interface SideNavProps {
  name: string;
  title: string;
  icon?: ReactElement;
  access?: UserCategory[]; // Update to use UserCategory[]
}

const nav_items: SideNavProps[] = [
  {
    name: "dashboard",
    title: "Dashboard",
    icon: <TbHome className="icon" />,
    access: ["Agent", "Enforcer", "MdaUser"],
  },
  {
    name: "tickets/transport",
    title: "Transport Ticket",
    icon: <TbTicket className="icon" />,
    access: ["Agent"],
  },
  {
    name: "tickets/verify",
    title: "Verify Ticket",
    icon: <TbLineScan className="icon" />,
    access: ["Agent"],
  },
  {
    name: "tickets/add",
    title: "Add Tickets",
    icon: <TbSquareRoundedPlus className="icon plus" />,
    access: ["Agent"],
  },
  {
    name: "user/account",
    title: "My Account",
    icon: <TbUser className="icon" />,
  },
  {
    name: "user/settings",
    title: "Extras",
    icon: <TbLayoutGridAdd className="icon" />,
  },
];

const SideNav = () => {
  const route = useGetRoute();

  const [userData, setUserData] = useState<{
    name?: string;
    user_cat?: UserCategory; // Explicitly type this as UserCategory
  } | null>(null);

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("USER_DATA");
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          setUserData({
            ...parsedData,
            user_cat: parsedData.user_cat as UserCategory, // Type assertion for user_cat
          });
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData({});
        }
      }
    }
  }, []);

  return (
    <div className="side-nav">
      <div className="side-nav_items_container">
        <div className="side-nav_items">
          {nav_items
            .filter(
              (item) =>
                !item.access || (userData?.user_cat && item.access.includes(userData.user_cat))
            )
            .map((item) => (
              <Link
                href={`/${item.name}`}
                key={item.name}
                className={`side-nav_item ${item.name === route ? "active" : "inactive"}`}
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            ))}
          <Link href={"/signin"} key={"logout"} className="side-nav_item logout">
            <span>
              <TbLogout2 className="icon out" />
            </span>
            <span>Sign Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
