import { CustomHeader } from '@/src/components/common/header';
import type { Metadata } from 'next';
import Link from 'next/link';
import React, { type ReactElement } from 'react'
import { FcEditImage, FcInTransit, FcLowPriority, FcShipped, FcShop } from 'react-icons/fc';
import "./style.scss";
import EnumerationStatsCard from '@/src/components/modules/enumeration/enumerationStatsCard';

export const metadata: Metadata = {
  title: "Transport Enumeration",
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
    link: "enumeration/transport",
    title: "Transport Enumeration",
    desc: "Enumerate vehicles",
    icon: <FcInTransit className="icon" />,
    // comingsoon: true
  },
      {
    link: "impoundment",
    title: "Vehicle impoundment",
    desc: "Impounding vehicles",
    icon: <FcShipped className="icon" />,
    comingsoon: true
  },
  {
    link: "enumeration/market",
    title: "Market Enumeration",
    desc: "Enumerate market asset",
    icon: <FcShop className="icon" />,
  },
  {
    link: "absaa/signage",
    title: "Signage Enumeration",
    desc: "Enumerate signages",
    icon: <FcEditImage className="icon" />,
    // comingsoon: true
  },
  {
    link: "enumeration/transport/view",
    title: "Manage Enumeration",
    desc: "Manage all enumerations",
    icon: <FcLowPriority className="icon" />,
    // comingsoon: true
  },
];


const EnumerationPage = () => {
  return (
    <div className="enumeration">
      <CustomHeader title="Enumerations Dashboard" desc={"Explore your enumeration"} />

      <div className="enumeration_container">
        <EnumerationStatsCard />

        <div className="enumeration_items">
          {items.map((item) => (
            <Link
              href={`/${item.link? item.link : "enumeration"}`}
              key={item.link}
              className={`enumeration_item`}
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