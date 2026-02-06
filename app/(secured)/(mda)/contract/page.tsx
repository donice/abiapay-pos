import { CustomHeader } from "@/src/components/common/header";
import type { Metadata } from "next";
import Link from "next/link";
import React, { type ReactElement } from "react";
import { FcBusinessman, FcButtingIn, FcReading, FcShop } from "react-icons/fc";
import "./style.scss";

export const metadata: Metadata = {
  title: "ABIAPAY Contract Management",
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
    link: "contract/fresh-registration",
    title: "Fresh Registration",
    desc: "Start a new contract registration process",
    icon: <FcBusinessman className="icon" />,
  },
  {
    link: "contract/renewal",
    title: "Apply for Renewal",
    desc: "Renew an existing contract",
    icon: <FcButtingIn className="icon" />,
  },
  {
    link: "contract/resume",
    title: "Resume/Edit Your Application",
    desc: "Continue or modify your pending application",
    icon: <FcShop className="icon" />,
  },
  {
    link: "contract/payment",
    title: "Make Payment",
    desc: "Process payment for your contract",
    icon: <FcReading className="icon" />,
  },
  {
    link: "contract/documents",
    title: "Upload Documents",
    desc: "Upload required contract documents",
    icon: <FcReading className="icon" />,
  },
];

const IdentityPage = () => {
  return (
    <div className="contract">
      <CustomHeader title="Contract Management" desc={"Manage contracts"} />

      <div className="contract_container">
        <div className="contract_items">
          {items.map((item) =>
            item.comingsoon ? (
              <div key={item.title} className={`contract_item`}>
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
                href={`/${item.link ? item.link : "contract"}`}
                key={item.link}
                className={`contract_item`}
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
