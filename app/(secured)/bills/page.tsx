import React, { ReactElement } from 'react'
import type { Metadata } from "next";
import BillsComponent from '@/src/components/modules/tickets/bills';
import { GoBackButton } from '@/src/components/common/button';
import { CustomHeader } from '@/src/components/common/header';
import { FcAddDatabase, FcNews } from 'react-icons/fc';
import Link from 'next/link';
import './style.scss';

export const metadata: Metadata = {
  title: "Transport Tickets - Agent Portal",
  description: "Agents Portal Tickets Page",
};


interface AccountsProps {
  link: string;
  title: string;
//   desc: string;
  icon: ReactElement;
}
const items: AccountsProps[] = [
  {
    link: "bills/add",
    title: "Create Bills",
    icon:<FcAddDatabase className="icon" />,
  },
  {
    link: "bills/view-bills",
    title: "View Bills",
    icon:<FcNews className="icon" />,
  }

];


const BillsPage = () => {
  return (
    <div>
      <div className="">
        <GoBackButton />
        <CustomHeader
          title='Bills'
          desc={"Select an option"}
        />

        <div className="bills-stats_container">
          <div className="bills-stats_items">
          {items.map((item) => (
            <Link
            href={`/${item.link}`}
            key={item.link}
            className={`bills-stats_item`}
            >
            <div>
                {" "}
                <span>{item.icon}</span>
                <div>
                <h2>{item.title}</h2>
                {/* <p>{item.desc}</p> */}
                </div>
            </div>
            </Link>
        ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillsPage;