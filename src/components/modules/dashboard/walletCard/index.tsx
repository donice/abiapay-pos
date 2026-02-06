import React from "react";
import "./style.scss";
import { formatAmount } from "@/src/utils/formatAmount";
import Image from "next/image";
import AccessBankLogo from "../../../assets/access_bank.png";
import FidelityBankLogo from "../../../assets/fidelity_bank.png";
import AccessBankWhiteLogo from "../../../assets/access_white.png";
import FidelityBankWhiteLogo from "../../../assets/fidelity_white.png";

interface WalletCardProps {
  bank: "access" | "fidelity";
  data: {
    total_credit?: string | null;
    total_debit?: string | null;
    balance?: string | null;
    earnings?: string | null;
    account_name?: string | null;
    account_number?: string | null;
    bank_name?: string | null;
    current_earnings?: string | null;
    wallet_balance?: string | null;
    wallet_id?: string | null;
    wallet_name?: string | null;

    this_week_count?: string | null;
    this_month_count?: string | null;
    this_week_amount?: string | null;
    this_month_amount?: string | null;
  };
}

export const WalletCard = ({ bank, data }: WalletCardProps) => {
  
  return (
    <section className="tickets-wallet">
      {" "}
      {bank === "access" ? (
        <div className="wallet-card">
          <div className="wallet-card_balance">
            <span>Wallet Balance</span>
            <span className="amount">₦{formatAmount(Number(data?.wallet_balance))}</span>
            <span className="wallet_id">Wallet ID: {data?.wallet_id}</span>
          </div>

          <div className="wallet-card_image">
            <Image src={AccessBankLogo} alt="access bank logo" />
          </div>

          <div className="wallet-card_earnings">
            <span> Current Earnings</span>
            <span>₦{formatAmount(Number(data?.current_earnings))}</span>
            <span>
              {/* Total Collected: <br /> ₦{formatAmount(Number(0))} */}
            </span>
          </div>
        </div>
      ) : (
        <div className="wallet-card">
          <div className="wallet-card_balance">
            <span>Wallet Balance</span>
            <span>₦{formatAmount(Number(data?.balance))}</span>
            <span>Wallet ID: {data?.account_number}</span>
          </div>

          <div className="wallet-card_image">
            <Image src={FidelityBankLogo} alt="fidelity bank logo" />
          </div>

          <div className="wallet-card_earnings">
            <span>Current Earnings</span>
            <span>₦{formatAmount(Number(data?.earnings))}</span>
            <span>
              {/* Total Collected: <br /> ₦{formatAmount(Number(0))} */}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export const TicketsWalletCard = ({ bank, data }: WalletCardProps) => {
  return (
    <>
      {" "}
      {bank === "access" ? (
        <div className="ticketwallet-card access">
          <div className="ticketwallet-card_balance">
            <div className="ticketwallet-card_balance_image">
              <Image src={AccessBankWhiteLogo} alt="access bank logo" />
            </div>{" "}
            <div>
              <p className="amount">₦{formatAmount(Number(data?.wallet_balance))}</p>
            <p className="wallet_id">{data?.wallet_id}</p>
            </div>
            
          </div>

          <div className="ticketwallet-card_earnings">
          <p className="current_earnings">
            This Week<br />{data?.this_week_count} Tickets / ₦{formatAmount(Number(data?.this_week_amount))}
            </p>
            <p className="current_earnings">
            This Month<br />{data?.this_month_count} Tickets / ₦{formatAmount(Number(data?.this_month_amount))}
            </p>
          </div>
        </div>
      ) : (
        <div className="ticketwallet-card fidelity">
          <div className="ticketwallet-card_balance">
            <div className="ticketwallet-card_balance_image">
              <Image src={FidelityBankWhiteLogo} alt="fidelity bank logo" />
            </div>{" "}
            <div>
              <p className="amount">₦{formatAmount(Number(data?.balance))}</p>
            <p className="wallet_id">{data?.account_number}</p>
            </div>
            
          </div>

          <div className="ticketwallet-card_earnings">
            <p className="current_earnings">
            This Week<br />{data?.this_week_count} Tickets / ₦{formatAmount(Number(data?.this_week_amount))}
            </p>
            <p className="current_earnings">
            This Month<br />{data?.this_month_count} Tickets / ₦{formatAmount(Number(data?.this_month_amount))}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
