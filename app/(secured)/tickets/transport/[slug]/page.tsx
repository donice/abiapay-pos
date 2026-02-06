"use client";
import { usePathname } from "next/navigation";
import { getLastPathSegment } from "@/src/utils/getLastPathSegment";
import React from "react";
import { BackButton, Button } from "@/src/components/common/button";
import "./style.scss";
import { formatAmount } from "@/src/utils/formatAmount";
import { useMutation, useQuery } from "@tanstack/react-query";

import toast from "react-hot-toast";
import {
  fetchTransactions,
  retryPayment,
  resendSMS,
} from "@/src/services/ticketsServices";
import { Loading } from "@/src/components/common/loader/redirecting";
import { TbSend } from "react-icons/tb";

const Dynamic = () => {
  const path = usePathname();
  const segment = getLastPathSegment(path);

  const { data, isError } = useQuery({
    queryKey: ["get_transactions"],
    queryFn: () => {
      return fetchTransactions();
    },
  });

  if (isError) {
    toast.error("Something went wrong fetching transactions");
    console.log("error");
  }

  const ticket = data?.data?.filter(
    (ticket: any) => ticket.idagent_transactions == segment
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { payment_ref: string }) => {
      return retryPayment({
        payment_ref: data.payment_ref,
      });
    },
    onSuccess: (data: any) => {
      if (data?.response_code == "00") {
        toast.success(data?.response_message);
      } else {
        toast.error(data?.response_message);
      }
    },
  });

  const { mutate: mutateResendSM, isPending: isPendingResendSM } = useMutation({
    mutationFn: (data: { payment_ref: string }) => resendSMS(data),
    onSuccess: (data: any) => {
      if (data?.response_code == "00") {
        toast.success(data?.response_message);
      } else {
        toast.error(data?.response_message);
      }
    },
  });

  const retryPaymentFn = () => {
    const paymentRef = ticket[0]?.payment_ref;
    if (paymentRef) {
      mutate({ payment_ref: paymentRef });
    } else {
      console.error("Payment reference is missing.");
    }
  };

  const resendSMSFn = () => {
    const paymentRef = ticket[0]?.payment_ref;

    if (paymentRef) {
      mutateResendSM({ payment_ref: paymentRef });
    } else {
      console.error("Payment reference is missing.");
    }
  };

  return (
    <div className="ticket-details">
      <h1>Ticket Transaction Details</h1>
      {data?.data ? (
        <>
          {ticket[0]?.status == "Processing" && (
            <Button
              text={"Reprocess Ticket"}
              loading={isPending}
              onClick={retryPaymentFn}
            />
          )}
          <div className="ticket-details_comp">
            <div>
              <p>Transaction Status</p>
              <p>{ticket[0]?.status || "-"}</p>
            </div>
            <div>
              <p>Plate Number</p>
              <p>{ticket[0]?.plate_number || "-"}</p>
            </div>

            <div>
              <p>Amount</p>
              <p>₦ {formatAmount(ticket[0]?.amount) || "-"}</p>
            </div>

            <div>
              <p>Taxpayer Name</p>
              <p>{ticket[0]?.taxpayer_name || "-"}</p>
            </div>

            <div>
              <p>Ticket Type</p>
              <p>{ticket[0]?.revenue_item || "-"}</p>
            </div>

            <div>
              <p>Phone Number</p>
              <p>{ticket[0]?.taxpayer_phone || "-"}</p>
            </div>

            <div>
              <p>Payment Period</p>
              <p>{ticket[0]?.payment_period || "-"}</p>
            </div>
            <div>
              <p>Agent Name</p>
              <p>{ticket[0]?.agent_user || "-"}</p>
            </div>
            <div>
              <p>Created Time</p>
              <p>{ticket[0]?.createtime || "-"}</p>
            </div>
            <div>
              <p>Payment Reference</p>
              <p>{ticket[0]?.payment_ref || "-"}</p>
            </div>
          </div>{" "}
        </>
      ) : (
        <Loading />
      )}

      <div className="ticket-details_form_btn">
        <Button
          text={"Resend SMS"}
          onClick={() => resendSMSFn()}
          loading={isPendingResendSM}
          children={
            <TbSend style={{ marginRight: "0.25rem" }} className="icon" />
          }
        />
        <BackButton link={"/tickets/transport"} />
      </div>
    </div>
  );
};

export default Dynamic;
