import React from "react";
import "./style.scss";
import { TbTicket, TbCreditCard, TbFolders } from "react-icons/tb";
import { useRouter } from "next/navigation";

interface props {
  icon?: string;
  name: string;
  amount: string;
  link?: string;
}
const StatsCard = ({ name, amount, link }: props) => {
  const router = useRouter();
  return (
    <div className={ name == "Tickets" ? "stats-card green" : "stats-card"} onClick={() => link ? router.push(link) : console.log("")}>
      <div className="stats-card_summ">
        <span>{
          name == "Tickets" ? (
            <TbTicket className="icon"/>
          ) : name === "ABSSIN" ? (
            <TbCreditCard className="icon"/>
          ) : (
            <TbFolders className="icon"/>
          )
        }</span>
        <span>{name}</span>
      </div>

      <div className="stats-card_amount">
        <span>{amount}</span>
      </div>
    </div>
  );
};

export default StatsCard;
