import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FcDeleteDatabase, FcAcceptDatabase, FcOk } from "react-icons/fc";
import "./style.scss";
import { BackButton, Button, PrimaryButton, SecondaryButton } from "../button";
import { AbiaEnumerationLarge } from "../Images";
import {
  TbCopy,
  TbCreditCardOff,
  TbPasswordMobilePhone,
  TbProgressCheck,
  TbRosetteDiscountCheckFilled,
  TbSquareRoundedCheck,
} from "react-icons/tb";
import QRCode from "react-qr-code";
import { LuMailCheck } from "react-icons/lu";
import { MdErrorOutline, MdOutlineWifiTetheringError } from "react-icons/md";
import { BiError } from "react-icons/bi";
import toast from "react-hot-toast";
import AccessBankLogo from "@/src/components/assets/access_bank.png";
import FidelityBankLogo from "@/src/components/assets/fidelity_bank.png";
import Image from "next/image";
import { CountdownTimer } from "@/src/utils/countdownTimer";

interface SuccessModalProps {
  maintext?: string;
  id?: string;
  text?: string;
  buttonText?: string;
  link?: string;
  onClick?: any;
  icon?: React.ReactNode;
}

interface MarketTicketModalProps {
  maintext?: string;
  id?: string;
  text?: string;
  link?: string;
  onClick?: any;
  icon?: React.ReactNode;
  details: {
    enum_id: string;
    payment_status?: string;
    payment_ref?: string;
  };
}

interface EmailSuccessModalProps {
  text?: string;
  id?: string;
  message?: string;
  link?: string;
  buttonText: string;
  onClick: any;
}

interface EnumerationModalProps {
  qr_link: string;
  id?: string;
  text?: string;
  link?: string;
  plate_number?: string;
  vehicle_category?: string;
}

interface InfoModalType {
  button_text?: string;
  text_header?: string;
  text_info?: string;
  link?: string;
  status: "success" | "error";
}

interface VehicleCheckSuccessModalType {
  text_header?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  state_of_registration?: string;
  expiry_date?: string;
  button_text?: string;
  onClick?: ((event: any) => void) | undefined;
}

const handleCopy = async (acct: string) => {
  if (!acct) {
    toast.error("Account number is missing");
    return;
  }

  try {
    await navigator.clipboard.writeText(acct);
    toast.success("Copied!");
  } catch (err) {
    console.error("Failed to copy:", err);
    toast.error("Failed to copy account number. Please try again.");
  }
};

export const SuccessModal: React.FC<SuccessModalProps> = ({
  maintext,
  id,
  text,
  buttonText,
  link,
  icon,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        {icon ? icon : <FcOk className="success_icon" />}
        <div className="modalContent">
          <h2>{maintext ? maintext : "Payment Successful"} </h2>
          <p>
            <span>{id ? id : ""}</span>{" "}
          </p>
          {/* {text && <p>{text}</p>} */}
          {link && (
            <button onClick={handleClick} className="button primary top">
              {buttonText}
            </button>
          )}

         {text && <SecondaryButton text="Create New" link={link || "/tickets/transport"} />}
        </div>
      </div>
    </div>
  );
};

export const MarketTicketModal: React.FC<MarketTicketModalProps> = ({
  maintext,
  text,
  icon,
  details,
}) => {
  const router = useRouter();
  return (
    <div className="modalOverlay">
      <div className="modal w-full min-w-sm">
        {icon ? icon : <FcOk className="success_icon" />}
        <div className="modalContent w-full gap-2">
          <div>
            <h2 className="">{maintext ? maintext : "Payment Successful"} </h2>
            <p>{text ? text : "View the details of your transaction below"}</p>
          </div>

          <div className="w-full border-2 p-4 rounded-xl mt-2 grid gap-4">
            <div className="flex justify-between ">
              <span className="block text-xs text-gray-500">
                Payment Reference:
              </span>
              <div className="col-span-2flex flex-col items-start justify-start  text-sm text-gray-600 font-semibold ">
                <span className=" text-sm text-gray-600 font-semibold">
                  {details.payment_ref}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="block text-xs text-gray-500">
                Enumeration ID:
              </span>
              <div className="col-span-2 flex flex-col items-start justify-start  text-sm text-gray-600 font-semibold ">
                <span className=" text-sm text-gray-600 font-semibold">
                  {details.enum_id}
                </span>
                <div className="flex gap-2 ">
                  <p>Copy</p>
                  <TbCopy
                    className="icon"
                    onClick={() => handleCopy(details.enum_id)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <PrimaryButton
            text={"View Receipt"}
            link={`/tickets/market/receipt/${details.enum_id}`}
          />
        </div>
      </div>
    </div>
  );
};

export const OtpSuccessModal = ({
  mode,
  maintext,
  subtext,
  buttontext,
  link,
}: {
  mode?: string;
  maintext?: string;
  subtext?: string;
  buttontext?: string;
  link: string;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        {mode == "verified" ? (
          <TbProgressCheck className="success_icon" />
        ) : (
          <TbPasswordMobilePhone className="success_icon" />
        )}
        <div className="modalContent">
          <h2>{maintext ? maintext : "Otp Sent Successfully"} </h2>
          <p>
            <span>{subtext ? subtext : ""}</span>{" "}
          </p>
          {/* {buttontext && <p>{buttontext}</p>} */}
          {link && (
            <button onClick={handleClick} className="button primary top">
              {buttontext ? buttontext : "Validate OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const AbssinSuccessModal = ({
  mode,
  maintext,
  subtext,
  buttontext,
  link,
}: {
  mode?: string;
  maintext?: string;
  subtext?: string;
  buttontext?: string;
  link: string;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        {mode == "success" ? (
          <TbSquareRoundedCheck className="success_icon" />
        ) : (
          <TbSquareRoundedCheck className="success_icon" />
        )}
        <div className="modalContent">
          <h2>{maintext ? maintext : "Congratulations! 🎉"} </h2>
          <p>
            <span>{"Your ABSSIN creation has been successful"}</span>{" "}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="button primary top"
          >
            Done
          </button>
          {link && (
            <button onClick={handleClick} className="button primary top">
              {buttontext ? buttontext : "Create Another ABSSIN"}
            </button>
          )}
          <button
            onClick={() => router.push("/enumeration/transport")}
            className="button primary top"
          >
            Enumerate Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export const ChangePasswordModal: React.FC<SuccessModalProps> = ({
  maintext,
  id,
  text,
  link,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        <FcOk className="success_icon" />
        <div className="modalContent">
          <h2>{maintext ? maintext : "Payment Successful"} </h2>
          <p>
            <span>{id ? id : ""}</span>{" "}
          </p>
          {/* {text && <p>{text}</p>} */}
          {link && (
            <button onClick={handleClick} className="button primary top">
              {text}
            </button>
          )}

          {/* <SecondaryButton text="Create New" link={"/settings"} /> */}
        </div>
      </div>
    </div>
  );
};

export const EmailSuccessModal: React.FC<EmailSuccessModalProps> = ({
  text,
  // id,
  message,
  // link,
  buttonText,
  onClick,
}) => {
  const router = useRouter();

  return (
    <div className="modalOverlay">
      <div className="modal">
        <LuMailCheck className="success_icon" />
        <div className="modalContent">
          <h2>{text ? text : "Email Delievered"} </h2>
          <p>{message ? message : "Email has been sent successfully"} </p>
          <button onClick={onClick} className="button primary top">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const EmblemModal = ({
  maintext,
  exp_date,
  payment_ref,
  button_text,
  onClick,
}: {
  maintext?: string;
  exp_date?: string;
  payment_ref?: string;
  text?: string;
  button_text?: string;
  onClick?: any;
}) => {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <FcOk className="success_icon" />
        <div className="modalContent">
          <h2>{maintext ? maintext : "Payment Successful"} </h2>
          <p>
            Payment Reference: <span>{payment_ref ? payment_ref : ""}</span>{" "}
          </p>
          <p>
            Expiration Date: <span>{exp_date ? exp_date : ""}</span>{" "}
          </p>
          <button onClick={onClick} className="button primary top">
            {button_text}
          </button>

          <SecondaryButton text="Create New Emblem" link="/tickets" />
        </div>
      </div>
    </div>
  );
};

export const OffloadingModal = ({
  maintext,
  payment_ref,
  button_text,
  onClick,
}: {
  maintext?: string;
  payment_ref?: string;
  text?: string;
  button_text?: string;
  onClick?: any;
}) => {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <FcOk className="success_icon" />
        <div className="modalContent">
          <h2>{maintext ? maintext : "Payment Successful"} </h2>
          <p>
            Payment Reference: <span>{payment_ref ? payment_ref : ""}</span>{" "}
          </p>
          <button onClick={onClick} className="button primary top">
            {button_text}
          </button>

          <SecondaryButton
            text="Register New Loading/Offloading"
            link="/tickets/transport/loading_offloading"
          />
        </div>
      </div>
    </div>
  );
};

export const SportModal = ({
  maintext,
  payment_ref,
  button_text,
  onClick,
}: {
  maintext?: string;
  payment_ref?: string;
  text?: string;
  button_text?: string;
  onClick?: any;
}) => {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <FcOk className="success_icon" />
        <div className="modalContent">
          <h2>{maintext ? maintext : "Payment Successful"} </h2>
          <p>
            Payment Reference: <span>{payment_ref ? payment_ref : ""}</span>{" "}
          </p>
          <button onClick={onClick} className="button primary top">
            {button_text}
          </button>

          <SecondaryButton
            text="Create New Sport Ticket"
            link="/tickets/sport"
          />
        </div>
      </div>
    </div>
  );
};

export const FlyingRevenue = ({
  maintext,
  payment_ref,
  button_text,
  onClick,
}: {
  maintext?: string;
  payment_ref?: string;
  text?: string;
  button_text?: string;
  onClick?: any;
}) => {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <FcOk className="success_icon" />
        <div className="modalContent">
          <h2>{maintext ? maintext : "Payment Successful"} </h2>
          <p>
            Payment Reference: <span>{payment_ref ? payment_ref : ""}</span>{" "}
          </p>
          <button onClick={onClick} className="button primary top">
            {button_text}
          </button>

          <SecondaryButton
            text="Create New Flying Revenue"
            link="/tickets/transport/flying-revenue"
          />
        </div>
      </div>
    </div>
  );
};
export const EnumerationModal: React.FC<SuccessModalProps> = ({
  maintext,
  id,
  text,
  link,
  onClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        <FcOk className="success_icon" />
        <div className="modalContent">
          <h2>{maintext ? maintext : "Payment Successful"} </h2>
          <p>
            <span>{id ? id : ""}</span>{" "}
          </p>
          {/* {text && <p>{text}</p>} */}
          {link && (
            <button onClick={handleClick} className="button primary top">
              {text}
            </button>
          )}

          <SecondaryButton text="Create New" link="/enumeration" />
        </div>
      </div>
    </div>
  );
};
export const InfoModal: React.FC<InfoModalType> = ({
  text_info,
  text_header,
  button_text,
  link,
}) => {
  const router = useRouter();

  return (
    <div className="modalOverlay">
      <div className="modal">
        {status === "success" ? (
          <FcAcceptDatabase className="success_icon" />
        ) : (
          <FcDeleteDatabase className="error_icon" />
        )}
        <div className="modalContent">
          <h2>{text_header}</h2>
          <p>
            <span>{text_info ? text_info : ""}</span>{" "}
          </p>
          {link && (
            <PrimaryButton link={link} text={button_text ? button_text : ""} />
          )}

          {/* <SecondaryButton text="Create New" link={"/tickets/transport/add"} /> */}
        </div>
      </div>
    </div>
  );
};

export const ErrorModal: React.FC<InfoModalType> = ({
  text_info,
  text_header,
  button_text,
  link,
}: {
  button_text?: string;
  text_header?: string;
  text_info?: string;
  link?: string;
}) => {
  const router = useRouter();

  return (
    <div className="modalOverlay">
      <div className="modal">
        <TbCreditCardOff className="error_icon" />
        <div className="modalContent">
          <h2>{text_header ? text_header : "Error Validating Info"}</h2>
          <p className="error_p">
            <span>{text_info ? text_info : ""}</span>{" "}
          </p>
          {link && (
            <PrimaryButton link={link} text={button_text ? button_text : ""} />
          )}

          {/* <SecondaryButton text="Create New" link={"/tickets/transport/add"} /> */}
        </div>
      </div>
    </div>
  );
};

export const VehicleCheckSuccessModal: React.FC<
  VehicleCheckSuccessModalType
> = ({
  text_header,
  vehicle_make,
  vehicle_model,
  vehicle_color,
  state_of_registration,
  expiry_date,
  button_text,
  onClick,
}) => {
  const handleClick = () => {};
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modal_icon">
          <TbRosetteDiscountCheckFilled className="success_icon" />
        </div>

        <div className="modalContent">
          <h2>{text_header}</h2>
          <div className="vehicle_items">
            <p>
              Vehicle Make:
              <span>{vehicle_make} </span>
            </p>
            <p>
              Vehicle Model:
              <span>{vehicle_model}</span>{" "}
            </p>
            <p>
              Vehicle Color:
              <span>{vehicle_color}</span>{" "}
            </p>
            <p>
              State Of Registration:
              <span>{state_of_registration}</span>{" "}
            </p>
            <p>
              Registration Expiry Date:
              <span>{expiry_date}</span>{" "}
            </p>
          </div>

          <Button onClick={onClick} text={button_text ? button_text : ""} />
        </div>
      </div>
    </div>
  );
};

export const EnumerationSuccessModal: React.FC<EnumerationModalProps> = ({
  id,
  text,
  link,
  qr_link,
  vehicle_category,
  plate_number,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal" id="enumeration_modal">
        <AbiaEnumerationLarge />
        <div className="modalHeader">
          <h1>ABIA STATE GOVERNMENT</h1>
          <h2> MINISTRY OF TRANSPORT</h2>
          <h3>ENUMERATION</h3>
        </div>
        <div className="modalContentEnum"></div>
        <div className="modalContentEnumContent">
          <p className="assetCode">{text}</p>
          <div className="custom_vehicle_details">
            <p className="vehicle_cat">COMMERCIAL VEHICLE</p>

            <div className="qr_container">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qr_link}
                viewBox={`0 0 256 256`}
              />
            </div>

            <p className="vehicle_type">{vehicle_category}</p>
          </div>

          <div>
            <p className="abssin_no">{id}</p>
            <span className="plate_number_title">PLATE NUMBER</span>
            <p className="plate_number">{plate_number}</p>
          </div>
        </div>
        <div className="btn-container">
          {/* <button className="button secondary">
            <TbPrinter /> Share
          </button> */}
          <SecondaryButton text="Create New" link={"/enumeration"} />
          <PrimaryButton text={"Done"} link={"/dashboard"} />
        </div>
      </div>
    </div>
  );
};

export const InformationModal = ({
  icon,
  mode,
  maintext,
  subtext,
  link,
  success_text,
  success_link,
  close,
}: {
  icon?: React.ReactNode;
  mode?: "success" | "error" | "warning" | "info";
  maintext?: string;
  subtext?: string;
  link?: string;
  success_text?: string;
  success_link?: string;
   close?: () => void;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    } else if (success_link) {
      // router.push(success_link);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        {icon ? (
          icon
        ) : mode == "error" ? (
          <MdOutlineWifiTetheringError className="error_icon" />
        ) : mode == "warning" ? (
          <BiError className="warning_icon" />
        ) : mode == "info" ? (
          <MdErrorOutline className="success_icon" />
        ) : (
          <FcOk className="success_icon" />
        )}

        <div className="modalContent">
          <h2>
            {mode == "warning" ? "Warning: " : mode == "error" ? "Error: " : ""}{" "}
            {maintext ? maintext : "Cannot Proceed"}{" "}
          </h2>
          <p>{subtext}</p>
          {link ? (
            <button onClick={handleClick} className="button primary top">
              Done
            </button>
          ) : (
            <button onClick={handleClick} className="button primary top">
              Ok
            </button>
          )}

          {mode == "success" && (
            <SecondaryButton
              onClick={close ?? handleClick}
              text={success_text ? success_text : ""}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export const InstantAccountModal = ({
  onClick,
  mode,
  link,
  virtual_acct_no,
  virtual_acct_name,
  transaction_amount,
  bank_name,
  expiry_datetime,
  loading,
}: {
  onClick?: () => void;
  mode?: "success" | "error" | "warning" | "info";
  link?: string;
  success_text?: string;
  virtual_acct_no: string;
  virtual_acct_name: string;
  transaction_amount: string;
  bank_name: string;
  expiry_datetime: string;
  loading?: boolean;
}) => {
  return (
    <div className="modalOverlay">
      <div className="modal">
        {bank_name == "Access Bank" ? (
          <Image
            src={AccessBankLogo}
            width={70}
            className="logo_icon"
            alt="access bank logo"
          />
        ) : (
          <Image
            src={FidelityBankLogo}
            width={70}
            className="logo_icon"
            alt="fidelity bank logo"
          />
        )}

        <div className="modalContent">
          <h2>
            {mode == "warning" ? "Warning: " : mode == "error" ? "Error: " : ""}{" "}
            Instant Account Transfer
          </h2>
          <p>Kindly transfer to the Bank Details shown below</p>

          <div className="account-details">
            <div className="account-details_items">
              <p>Bank Name:</p>
              <p>{bank_name}</p>
            </div>{" "}
            <div className="account-details_items">
              <p>Account Name:</p>
              <p>{virtual_acct_name}</p>
            </div>
            <div className="account-details_items">
              <p>Account Number:</p>
              <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <TbCopy
                  className="icon"
                  onClick={() => handleCopy(virtual_acct_no)}
                  style={{ cursor: "pointer" }}
                />{" "}
                {virtual_acct_no}
              </p>
            </div>
            <div className="account-details_items">
              <p>Transaction Amount:</p>
              <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <TbCopy
                  className="icon"
                  onClick={() => handleCopy(transaction_amount)}
                  style={{ cursor: "pointer" }}
                />{" "}
                ₦{transaction_amount}
              </p>
            </div>
          </div>
          <p style={{ marginBottom: "20px" }}>
            This account is only valid for this transaction. It will expire in{" "}
            <CountdownTimer targetDate={expiry_datetime} />
          </p>

          <div className="modalActions">
            <Button
              text={"Confirm my Payment"}
              loading={loading}
              disabled={loading}
              onClick={onClick}
            />
            <BackButton link={"/bills"} />
          </div>
        </div>
      </div>
    </div>
  );
};
