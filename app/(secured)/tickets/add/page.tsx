import React, { ReactElement } from "react";
import { Metadata } from "next";
import { CustomHeader } from "@/src/components/common/header";
import { FcShipped, FcPaid, FcAcceptDatabase, FcMoneyTransfer } from "react-icons/fc";
import Link from "next/link";
import "./style.scss";
import UsingPlateNumberExportComponent from "@/src/components/modules/find/using-plate-number/export_comp";

export const metadata: Metadata = {
  title: "Create Ticket",
  description: "Agents Portal Add  Tickets Page",
};

interface TicketsProps {
  name: string;
  title: string;
  desc: string;
  icon: ReactElement;
}

const tickets: TicketsProps[] = [
  {
    name: "tickets/transport/add",
    title: "Create Transport Tickets",
    desc: "Create transport ticket",
    icon: <FcShipped className="icon" />,
  },
];

const AddTicketPage = () => {
  return (
    <div className="ticketspage">
      <CustomHeader title="Sharp Sharp" desc={"Add your tickets"} />

      <div className="ticketspage_items">
        <UsingPlateNumberExportComponent />

        {tickets.map((item) => (
          <Link
            href={`/${item.name}`}
            key={item.name}
            className={`ticketspage_item`}
          >
            <div >
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
  );
};

export default AddTicketPage;
