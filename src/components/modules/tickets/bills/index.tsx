import React from "react";
import { CustomHeader } from "@/src/components/common/header";
import "./style.scss";
import BillsTable from "./billsTable";
import { SecondaryButton } from "@/src/components/common/button";

const BillsComponent = () => {
  return (
    <div className="bills_comp">
      <header className="bills_comp_header">
        <CustomHeader title="Bills" desc="View your bills" />
        {/* <div className="bills_header_buttons mb-4">
          <SecondaryButton text="Add Bills" link="/bills/add" />
        </div> */}
      </header>
      {/* <TicketsWalletCard /> */}

      <div className="bills_comp_table">
        <BillsTable />
      </div>
    </div>
  );
};

export default BillsComponent;
