"use client";
import { usePathname } from "next/navigation";
import { getLastPathSegment } from "@/src/utils/getLastPathSegment";
import React, { useEffect, useState } from "react";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { BackButton, Button } from "@/src/components/common/button";
import "./style.scss";
import { formatAmount } from "@/src/utils/formatAmount";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateTicketPayload } from "@/src/components/types/ticketTypes";
import { getCurrentDateTime } from "@/src/utils/getCurrentDateTime";
import { randomInvoiceGenerator } from "@/src/utils/randomInvoiceGenerator";
import { useMutation } from "react-query";
import { createNewTicket } from "@/src/services/ticketsServices";
import toast from "react-hot-toast";
import { getErrorMessages } from "@/src/utils/helper";
import { InformationModal, SuccessModal } from "@/src/components/common/modal";
import { isBrowser } from "@/src/utils/isBrowser";
import { bankOptions } from "@/src/lib/app";

const Dynamic = () => {
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("USER_DATA");
      if (data) {
        try {
          setUserData(JSON.parse(data));
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData({});
        }
      }
    }
  }, []);

  const path = usePathname();
  const [show, setShow] = useState({
    mode: false,
    state: "",
    message: "",
  });
  const segment = getLastPathSegment(path);
  let fetched_data = sessionStorage.getItem("TICKETS_DATA");
  const data = fetched_data && JSON.parse(fetched_data);

  const ticket = data?.filter(
    (ticket: any) => ticket.idagent_transactions == segment
  );

  // console.log(ticket);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTicketPayload>({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      transaction_date: getCurrentDateTime(),
      invoice_id: `INV${randomInvoiceGenerator()}`,
      paymentPeriod: ticket[0]?.payment_period || "",
      productCode: ticket[0]?.revenue_item || "",
      next_expiration_date: ticket[0]?.next_date || "",
      no_of_days: ticket[0]?.no_of_days || "",
      amount: ticket[0]?.amount || 0,
      lga: ticket[0]?.lga || "",
      agentEmail: userData?.email || "",
      plateNumber: ticket[0]?.plate_number || "",
      taxPayerPhone: ticket[0]?.taxpayer_phone || "",
      taxPayerName: ticket[0]?.taxpayer_name || "",
      wallet_type: "fidelity",
    },
  });

  setValue("agentEmail", userData?.email || "");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateTicketPayload) => {
      sessionStorage.setItem("TRANSPORT_INVOICE", JSON.stringify(data));
      return createNewTicket(data);
    },
    mutationKey: ["fetch_transactions"],
    onSuccess: (data) => {
      // data.message && toast.error(getErrorMessages(data.message));
      if (data.response_code == "00") {
        toast.success(data.response_message);
        setShow({
          mode: true,
          state: "success",
          message: data.response_message,
        });
      } else if (data.response_code == "12") {
        toast.custom(data.response_message || getErrorMessages(data.message));
        setShow({
          mode: true,
          state: "warning",
          message: data.response_message,
        });
      } else {
        toast.error(data.response_message || getErrorMessages(data.message));
        setShow({
          mode: true,
          state: "error",
          message: data.response_message || getErrorMessages(data.message),
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<CreateTicketPayload> = (data) => {
    try {
      // console.log(data);
      mutate(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ticket-details">
      <h1>Ticket Details</h1>
      <div className="ticket-details_comp">
        <div>
          <p>Plate Number</p>
          <p>{ticket[0]?.plate_number}</p>
        </div>

        <div>
          <p>Amount</p>
          <p>₦ {formatAmount(ticket[0]?.amount)}</p>
        </div>

        <div>
          <p>Taxpayer Name</p>
          <p>{ticket[0]?.taxpayer_name}</p>
        </div>

        <div>
          <p>Ticket Type</p>
          <p>{ticket[0]?.revenue_item}</p>
        </div>

        <div>
          <p>Phone Number</p>
          <p>{ticket[0]?.taxpayer_phone}</p>
        </div>

        <div>
          <p>Payment Period</p>
          <p>{ticket[0]?.payment_period}</p>
        </div>
      </div>

      <form className="ticket-details_form" onSubmit={handleSubmit(onSubmit)}>
        {ticket[0]?.no_of_days == "" || ticket[0]?.no_of_days == null && (
          <FormTextInput
            label={"No of Days"}
            placeholder="Enter No of Days"
            name={"no_of_days"}
            register={register}
            validation={{ required: true }}
            error={errors.no_of_days}
          />
        )}
        <SelectInput
          label={"Choose Wallet"}
          name={"wallet_type"}
          id={"wallet_type"}
          register={register}
          validation={{ required: true }}
          options={bankOptions}
          placeholder="Select Wallet Type"
          error={!!errors.wallet_type}
        />
        <div className="ticket-details_form_btn">
          <Button text={"Re-Vend Ticket"} loading={isPending} />
          <BackButton link={"/find/using-plate-number"} />
        </div>
      </form>
      {show.mode == true && show.state == "success" && (
        <SuccessModal
          text="View Receipt"
          link="/tickets/transport/add/summary"
          id={`Valid for: ${ticket[0]?.payment_period}, Payment for: ${ticket[0]?.revenue_item} `}
          buttonText="Done"
        />
      )}
      {show.mode == true && show.state == "warning" && (
        <InformationModal
          mode="warning"
          maintext={show.message}
          subtext="Cannot proceed the revending of this ticket"
          link="/find/using-plate-number"
        />
      )}
      {show.mode == true && show.state == "error" && (
        <InformationModal
          mode="error"
          maintext={show.message}
          subtext="Cannot proceed the revending of this ticket"
          close={() => setShow({ mode: false, state: "", message: "" })}

        // link="/find/using-plate-number"
        />
      )}
    </div>
  );
};

export default Dynamic;
