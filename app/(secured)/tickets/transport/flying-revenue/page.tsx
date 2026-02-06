import React from "react";
import type { Metadata } from "next";
import { CustomHeader } from "@/src/components/common/header";
import Link from "next/link";
import "./style.scss";
import { haulages } from "@/src/components/modules/tickets/transport/flying-revenue/lib/haulages";

export const metadata: Metadata = {
  title: "Manage Ticket",
  description: "Agents Portal Tickets Page",
};


const TicketPage = () => {
  return (
    <div className="flying-revenue">
      <CustomHeader title="Flying Revenue" desc={"Manage your haulage items"} />

      <div className="flying-revenue_container">

        <div className="flying-revenue_items">
          {haulages.map((item) => (
            <Link
              href={`/${item.name}`}
              key={item.name}
              className={"flying-revenue_item"}
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
  );
};

export default TicketPage;
