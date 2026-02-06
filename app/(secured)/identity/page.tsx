import { CustomHeader } from "@/src/components/common/header";
import type { Metadata } from "next";
import Link from "next/link";
import React, { type ReactElement } from "react";
import { FcBusinessman, FcButtingIn, FcReading, FcShop } from "react-icons/fc";
import "./style.scss";
import IdentityStatsCard from "@/src/components/modules/identity/identityStatsCard";

export const metadata: Metadata = {
  title: "ABIAPAY Identity",
  description: "Manage all Identities tied to your ABIAPAY account",
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
    link: "identity/create/individual/verify",
    title: "Create Individual ABSSIN",
    desc: "Create an ABSSIN for individual",
    icon: <FcBusinessman className="icon" />,
  },
  {
    link: "identity/infant",
    title: "Dependent ABSSIN",
    desc: "ABSSIN for dependents",
    icon: <FcButtingIn className="icon" />,
  },
  {
    link: "identity/create/business",
    title: "Create Business ABSSIN",
    desc: "Create an ABSSIN for business",
    icon: <FcShop className="icon" />,
  },

  {
    link: "identity/view/individual",
    title: "View Individuals",
    desc: "View all individual ABSSIN",
    icon: <FcReading className="icon" />,
  },
  {
    link: "identity/view/business",
    title: "View Businesses",
    desc: "View all Business ABSSIN",
    icon: <FcReading className="icon" />,
  },
];

const IdentityPage = () => {
  return (
    <div className="identity">
      <CustomHeader title="Identity Dashboard" desc={"Manage identities"} />

      <div className="identity_container">
        <IdentityStatsCard />
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

export default IdentityPage;
