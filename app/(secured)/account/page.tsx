import { CustomHeader } from '@/src/components/common/header';
import type { Metadata } from 'next';
import Link from 'next/link';
import React, { type ReactElement } from 'react'
import { FcEditImage, FcInTransit, FcLowPriority, FcRules, FcShop } from 'react-icons/fc';
import "./style.scss";
import EnumerationStatsCard from '@/src/components/modules/enumeration/enumerationStatsCard';

export const metadata: Metadata = {
  title: "My Account",
  description: "Enumerate Vehicles",
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
    link: "account/statement",
    title: "My Statement",
    desc: "View my account statement",
    icon: <FcRules className="icon" />,
    // comingsoon: true
  },

];


const EnumerationPage = () => {
  return (
    <div className="account">
      <CustomHeader title="My Account" desc={"Explore your account"} />

      <div className="account_container">
        <EnumerationStatsCard />

        <div className="account_items">
          {items.map((item) => (
            <Link
              href={`/${item.link? item.link : "account"}`}
              key={item.link}
              className={`account_item`}
            >
              {
                item.comingsoon ? <div className="comingsoon">Coming Soon</div> : null
              }
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
}

export default EnumerationPage;