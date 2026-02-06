import React, { type ReactElement } from "react";
import type { Metadata } from "next";
import { CustomHeader } from "@/src/components/common/header";
import {
  FcGallery,
  FcSimCardChip,
} from "react-icons/fc";
import Link from "next/link";
import "./style.scss";

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
    name: "prints/sticker",
    title: "Stickers",
    desc: "Print bulk stickers",
    icon: <FcGallery className="icon" />,
  },  
  {
    name: "prints/id",
    title: "ID Cards",
    desc: "Print bulk ID cards",
    icon: <FcSimCardChip className="icon" />,
  },
];

const TicketPage = () => {
  return (
    <div className="bulkprints">
      <CustomHeader title="Bulk Prints" desc={"Manage your tickets"} />

      <div className="bulkprints_container">

        <div className="bulkprints_items">
          {tickets.map((item) => (
            <Link
              href={`/${item.name}`}
              key={item.name}
              className={"bulkprints_item"}
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
