import React from "react";
import "./style.scss";
import AddMarketTicketForm from "./form";

const MarketTicketDetailsComponent = ({ id }: { id: string }) => {
  return (
    <section className="market_add">
      <div className="market-comp">
        <div className="market-comp_form">
          <AddMarketTicketForm id={id}/>
        </div>
      </div>
    </section>
  );
};

export default MarketTicketDetailsComponent;
