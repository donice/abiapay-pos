import React from "react";
import "./style.scss";
import AddMarketTicketForm from "./form";

const AddMarketTicketComponent = () => {
  return (
    <section className="market_add">
      <div className="market-comp">
        <div className="market-comp_form">
          <AddMarketTicketForm />
        </div>
      </div>
    </section>
  );
};

export default AddMarketTicketComponent;
