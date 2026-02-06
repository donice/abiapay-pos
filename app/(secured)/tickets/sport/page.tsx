import React, { type ReactElement } from "react";
import type { Metadata } from "next";
import { CustomHeader } from "@/src/components/common/header";
import { SiNewjapanprowrestling } from "react-icons/si";
import Link from "next/link";
import "./style.scss";
import { TbUser, TbUsersGroup } from "react-icons/tb";

export const metadata: Metadata = {
  title: "Manage Ticket",
  description: "Agents Portal Tickets Page",
};

interface TicketsProps {
  name: string;
  title: string;
  desc: string;
  icon: ReactElement;
}

const tickets: TicketsProps[] = [
  {
    name: "tickets/sport/single/abian",
    title: "Abian Ticket",
    desc: "Create sport ticket for Abian",
    icon: <SiNewjapanprowrestling className="icon" />,
  },
  {
    name: "tickets/sport/single/guest",
    title: "Guest Ticket",
    desc: "Create sport ticket for Guest",
    icon: <TbUser className="icon" />,
  },
  {
    name: "tickets/sport/group/abian",
    title: "Group Abian Ticket",
    desc: "Create sport ticket for Abian",
    icon: <SiNewjapanprowrestling className="icon" />,
  },
  {
    name: "tickets/sport/group/guest",
    title: "Group Guest Ticket",
    desc: "Create sport ticket for Guest",
    icon: <TbUsersGroup className="icon" />,
  },
];

const TicketPage = () => {
  return (
    <div className="sports-ticket">
      <CustomHeader title="Sports Ticket Dashboard" desc={"Create & Manage Sport Tickets"} />

      <div className="sports-ticket_container">
        <div className="sports-ticket_items">
          {tickets.map((item) => (
            <Link
              href={`/${item.name}`}
              key={item.name}
              className={"sports-ticket_item"}
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

export default TicketPage;
