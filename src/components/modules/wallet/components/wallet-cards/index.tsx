import React, { useState } from "react";
import "./style.scss";
import { TbCircleCheckFilled } from "react-icons/tb";
import Image from "next/image";
import AccessBankLogo from "../../../../assets/access_bank.png";
import FidelityBankLogo from "../../../../assets/fidelity_bank.png";
import { formatAmount } from "@/src/utils/formatAmount";


const TransferWalletCards = ({data, activeAccount, setActiveAccount, type, onWalletSelect}: {
  data: any,
  activeAccount: string,
  setActiveAccount: any,
  type?: "balance" | "earnings"
  onWalletSelect?: any
}) => {

  return (
    <section className="walletcard">
      <div className="walletcard_container">
        <div
          onClick={() => {setActiveAccount("fidelity"), onWalletSelect("fidelity")}}
          className={`wallet ${activeAccount === "fidelity" ? "active" : ""}`}
        >
          <div className="wallet_details">
            <div className="wallet_details_icon">
              <Image src={FidelityBankLogo} alt="fidelity bank logo" />
            </div>
            <div>
              <p className="amount">
                ₦ {formatAmount(type === "earnings" ? data?.fidelity?.earnings : data?.fidelity?.balance)}
              </p>
              <p>
                Wallet: <span>{data?.fidelity?.account_number}</span>
              </p>
            </div>
          </div>
          <div className="wallet_check">
            {activeAccount === "fidelity" && (
              <TbCircleCheckFilled className="icon" />
            )}
          </div>
        </div>
        <div
          onClick={() => {setActiveAccount("access"), onWalletSelect("access")}}
          className={`wallet ${activeAccount === "access" ? "active" : ""}`}
        >
          <div className="wallet_details">
            <div className="wallet_details_icon">
              <Image src={AccessBankLogo} alt="access bank logo" />
            </div>
            <div>
              <p className="amount">
                ₦ {formatAmount( type === "earnings" ? data?.access?.current_earnings : data?.access?.wallet_balance)}
              </p>
              <p>
                Wallet: <span>{data?.access?.wallet_id}</span>
              </p>
            </div>
          </div>
          <div className="wallet_check">
            {activeAccount === "access" && (
              <TbCircleCheckFilled className="icon" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransferWalletCards;

export const IndividualTransferWalletCards = ({data, activeAccount}: any) => {

  return (
    <section className="walletcard">
      <div className="walletcard_container">
       {activeAccount === "fidelity" ? <div
          className={`wallet ${activeAccount === "fidelity" ? "active" : ""}`}
        >
          <div className="wallet_details">
            <div className="wallet_details_icon">
              <Image src={FidelityBankLogo} alt="fidelity bank logo" />
            </div>
            <div>
              <p className="amount">
                ₦ {formatAmount(data?.fidelity?.earnings)}
              </p>
              <p>
                Wallet: <span>{data?.fidelity?.account_number}</span>
              </p>
            </div>
          </div>
          <div className="wallet_check">
            {activeAccount === "fidelity" && (
              <TbCircleCheckFilled className="icon" />
            )}
          </div>
        </div> :
        <div
          className={`wallet ${activeAccount === "access" ? "active" : ""}`}
        >
          <div className="wallet_details">
            <div className="wallet_details_icon">
              <Image src={AccessBankLogo} alt="access bank logo" />
            </div>
            <div>
              <p className="amount">
                ₦ {formatAmount(data?.access?.current_earnings)}
              </p>
              <p>
                Wallet: <span>{data?.access?.wallet_id}</span>
              </p>
            </div>
          </div>
          <div className="wallet_check">
            {activeAccount === "access" && (
              <TbCircleCheckFilled className="icon" />
            )}
          </div>
        </div>}
      </div>
    </section>
  );
};
