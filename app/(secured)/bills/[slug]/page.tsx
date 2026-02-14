"use client";
import { usePathname } from "next/navigation";
import { getLastPathSegment } from "@/src/utils/getLastPathSegment";
import React, { useEffect, useMemo, useState } from "react";
import {
  BackButton,
  FormButton,
  PrimaryButton,
} from "@/src/components/common/button";
import "./style.scss";
import { formatAmount } from "@/src/utils/formatAmount";
import { useMutation, useQuery } from "react-query";

import toast from "react-hot-toast";
import { Loading } from "@/src/components/common/loader/redirecting";
import {
  BillPaymentPayload,
  confirmInstantAccountPayment,
  ConfirmInstantAccountPaymentPayload,
  FetchBillPayload,
  fetchBillPayment,
  fetchBills,
  fetchInstantAccount,
  sendBill,
  SendBillPayload,
} from "@/src/services/billServices";
import { useForm } from "react-hook-form";
import { SelectInput } from "@/src/components/common/input";
import {
  InformationModal,
  InstantAccountModal,
} from "@/src/components/common/modal";
import { getErrorMessages } from "@/src/utils/helper";
import { PiReceiptDuotone } from "react-icons/pi";
import { bankOptions } from "@/src/lib/app";

const Dynamic = () => {
  const path = usePathname();
  const segment = getLastPathSegment(path);
  const [billIsueeDetails, setBillIsueeDetails] = useState<any>({});
  const [instantAccountDetails, setInstantAccountDetails] = useState<any>({
    virtual_acct_no: "",
    virtual_acct_name: "",
    request_id: "",
    expiry_datetime: "",
    transaction_amount: "",
    bank_name: "",
  });

  const [show, setShow] = useState({
    mode: false,
    state: "",
    message: "",
    sum_message: "",
  });

  const [viewItems, setViewItems] = useState<any>(false);

  const { mutate } = useMutation({
    mutationFn: (data: FetchBillPayload) => {
      return fetchBillPayment(data);
    },
    onSuccess: (data: any) => {
      setBillIsueeDetails(data?.response_data);
    },
  });

  const { mutate:mutateSendBill } = useMutation({

    mutationFn: (data: SendBillPayload) => {
      return sendBill(data);
    },
    onSuccess: (data: any) => {
      if (data.response_code == "96"){
        toast.error(data.response_message);
      }
      else {
        toast.success(data.response_message);
      }
    },
  });

  const { mutate: mutateConfirmPayment, isPending: isPendingConfirmPayment } =
    useMutation({
      mutationFn: (data: ConfirmInstantAccountPaymentPayload) => {
        console.log(data);
        return confirmInstantAccountPayment(data);
      },

      onSuccess: (data: any) => {
        if (data.response_code == "00") {
          console.log(data.response_data);
          toast.success(data.response_message);
        } else {
          const toastId = toast.loading(data.response_message, {
            id: "confirm",
          });
          setTimeout(() => {
            toast.dismiss(toastId);
          }, 2000);
        }
      },
    });

  const { mutate: mutateGenerateAccount, isPending: isPendingGenerateAccount } =
    useMutation({
      mutationFn: (data: BillPaymentPayload) => {
        return fetchInstantAccount(data);
      },
      onSuccess: (data: any) => {
        if (data.response_code == "00") {
          setShow({
            mode: true,
            state: "success",
            message: data.response_message,

            sum_message:
              "Make payment using your virtual account details provided below.",
          });
          setInstantAccountDetails({
            virtual_acct_no: data?.response_data?.virtual_acct_no || "",
            virtual_acct_name: data?.response_data?.virtual_acct_name || "",
            expiry_datetime: data?.response_data?.expiry_datetime || "",
            transaction_amount: data?.response_data?.transaction_amount || "",
            bank_name: data?.response_data?.bank_name || "",
          });
          console.log(data.response_data);
        } else if (data.response_code == "05") {
          setShow({
            mode: true,
            state: "warning",
            message: data.response_message,
            sum_message: "",
          });
        } else {
          setShow({
            mode: true,
            state: "error",
            message: data.response_message || getErrorMessages(data.message),
            sum_message: "",
          });
        }
      },
    });

  const { data, isError } = useQuery({
    queryKey: ["get_transactions"],
    queryFn: () => {
      return fetchBills();
    },
  });

  if (isError) {
    toast.error("Something went wrong fetching transactions");
    console.log("error");
  }

  const ticket = useMemo(() => {
    return data?.response_data?.filter(
      (ticket: { transref: string }) => ticket.transref === segment
    );
  }, [data, segment]);

  useEffect(() => {
    if (ticket && ticket.length > 0) {
      mutate({ bill_ref: ticket[0]?.transref });
    }
  }, [ticket]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BillPaymentPayload>({
    defaultValues: {
      notice_number: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      account_type: "access",
    },
  });


  const onSubmit = (formData: any) => {
    console.log(formData);
    mutateGenerateAccount(formData);
  };

  useEffect(() => {
    if (billIsueeDetails && ticket && ticket.length > 0) {
      setValue("notice_number", segment);
      setValue("customer_name", billIsueeDetails?.taxpayer_name);
      setValue("customer_email", billIsueeDetails?.agent_email);
      setValue("customer_phone", billIsueeDetails?.taxpayer_phone);
    }
  }, [billIsueeDetails]);

  return (
    <div className="bill-details">
      <h1>Bill Details</h1>
      {data?.response_data ? (
        <div className="bill-details_comp">
          <div>
            <p className="font-bold">Bill Status</p>
            <p>{ticket[0]?.status || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Occurrence</p>
            <p>{ticket[0]?.occurrence || "-"}</p>
          </div>

          <div>
            <p className="font-bold">Amount</p>
            <p>₦{formatAmount(ticket[0]?.amount) || "-"}</p>
          </div>

          <div>
            <p className="font-bold">Taxpayer Name</p>
            <p>{billIsueeDetails?.taxpayer_name || "-"}</p>
          </div>

          <div>
            <p className="font-bold">Taxpayer Phone</p>
            <p>{billIsueeDetails?.taxpayer_phone || "-"}</p>
          </div>
          <div>
            <p className="font-bold">ABSSIN</p>
            <p>{ticket[0]?.taxpayer || "-"}</p>
          </div>

          <div>
            <p className="font-bold">MDA</p>
            <p>{ticket[0]?.mda || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Revenue Item</p>
            <p>{ticket[0]?.rev_item || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Bill Reference</p>
            <p>{ticket[0]?.transref || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Date Created</p>
            <p>{ticket[0]?.transdate || "-"}</p>
          </div>
        </div>
      ) : (
        <Loading />
      )}

      <button
        className="bill-details_btn"
        onClick={() => setViewItems(!viewItems)}
      >
        <PiReceiptDuotone className="icon" />{" "}
        <span>{!viewItems ? "View Bill Items" : "Hide Bill Items"}</span>
      </button>

      {viewItems &&
        billIsueeDetails?.items?.map((item: any, index: number) => (
          <div className="bill-details_comp" key={index}>
            <div>
              <p className="font-bold">Revenue Item</p>
              <p>{item?.revenue_item || "-"}</p>
            </div>
            <div>
              <p className="font-bold">Amount</p>
              <p>₦{formatAmount(item?.amount) || "-"}</p>
            </div>
            <div>
              <p className="font-bold">Payment Ref</p>
              <p>{item?.payment_ref || "-"}</p>
            </div>
          </div>
        ))}

      <form onSubmit={handleSubmit(onSubmit)} className="">
        <SelectInput
          label="Choose Wallet"
          name="account_type"
          id="account_type"
          register={register}
          validation={{ required: true }}
          options={bankOptions}
          placeholder="Select Wallet Type"
          error={!!errors.account_type}
        />
        <div className="bill-details_form_btn">
          <FormButton
            text={"Generate Instant Account"}
            disabled={isPendingGenerateAccount}
            loading={isPendingGenerateAccount}
          />
        </div>
      </form>
      <div className="w-full grid gap-2 -mt-3">
        <div className="w-full grid " onClick={() => mutateSendBill({ bill_ref: ticket[0]?.transref })}
        >
              <PrimaryButton text={"Send Bill"} />
        </div>
      <BackButton link={"/bills"} />
      </div>
      {show.mode == true && show.state == "success" && (
        // {show && (
        <InstantAccountModal
          onClick={() => mutateConfirmPayment(ticket[0]?.transref)}
          mode="success"
          link="/bills"
          success_text="Proceed to confirm payment"
          virtual_acct_no={instantAccountDetails?.virtual_acct_no}
          virtual_acct_name={instantAccountDetails?.virtual_acct_name}
          transaction_amount={instantAccountDetails?.transaction_amount}
          bank_name={instantAccountDetails?.bank_name}
          expiry_datetime={instantAccountDetails?.expiry_datetime}
          loading={isPendingConfirmPayment}
        />
      )}
      {show.mode == true && show.state == "warning" && (
        <InformationModal
          mode="warning"
          maintext={show.message}
          subtext="Cannot proceed this bill instant account creation"
          link={`/bills`}
        />
      )}
      {show.mode == true && show.state == "error" && (
        <InformationModal
          mode="error"
          maintext={show.message}
          subtext="Cannot proceed this bill instant account creation"
          link={`/bills`}
        />
      )}
    </div>
  );
};

export default Dynamic;
