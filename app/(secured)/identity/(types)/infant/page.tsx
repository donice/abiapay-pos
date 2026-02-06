import { CustomHeader } from "@/src/components/common/header";
import type { Metadata } from "next";
import Link from "next/link";
import React, { type ReactElement } from "react";
import { FcButtingIn, FcStackOfPhotos } from "react-icons/fc";
import "./../../style.scss";

export const metadata: Metadata = {
  title: "Dependent ABSSIN",
  description: "Create Individual ABSSIN for Infant",
};

interface AccountsProps {
  link?: string;
  title: string;
  desc: string;
  icon: ReactElement;
  comingsoon?: boolean;
}

const items: AccountsProps[] = [
  {
    link: "identity/create/infant",
    title: "Create Single",
    desc: " Single ABSSIN for dependents",
    icon: <FcButtingIn className="icon" />,
  },
  {
    link: "identity/infant/bulk-add",
    title: "Create Bulk",
    desc: " Bulk ABSSIN for dependents",
    icon: <FcStackOfPhotos className="icon" />,
  },
];

const DependentsAbssinPage = () => {
  return (
    <div className="identity">
      <CustomHeader
        title="Dependent ABSSIN Dashboard"
        desc={"Manage Dependents"}
      />

      <div className="identity_container">
        <div className="identity_items">
          {items.map((item) =>
            item.comingsoon ? (
              <div key={item.title} className={`identity_item`}>
                <div className="comingsoon">Coming Soon</div>
                <div>
                  <span>{item.icon}</span>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href={`/${item.link ? item.link : "identity"}`}
                key={item.link}
                className={`identity_item`}
              >
                <div>
                  <span>{item.icon}</span>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DependentsAbssinPage;
