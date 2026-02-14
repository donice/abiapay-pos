"use client";
import { usePathname } from "next/navigation";
import { getLastPathSegment } from "@/src/utils/getLastPathSegment";
import React, { useMemo, useState } from "react";
import "./style.scss";
import { formatAmount } from "@/src/utils/formatAmount";
import { useQuery } from "react-query";

import toast from "react-hot-toast";
import { Loading } from "@/src/components/common/loader/redirecting";
import {
  BillPaymentPayload,
  fetchBills,
} from "@/src/services/billServices";
import { useForm } from "react-hook-form";
import { InformationModal } from "@/src/components/common/modal";
import { fetchReceipts } from "@/src/services/receiptsServices";

const Dynamic = () => {
  const path = usePathname();
  const segment = getLastPathSegment(path);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["get_receipts"],
    queryFn: () => {
      return fetchReceipts();
    },
  });

  if (isError) {
    toast.error("Something went wrong fetching transactions");
    console.log("error");
  }

  const ticket = useMemo(() => {
    return data?.filter(
      (ticket: { transref: string }) => ticket.transref === segment
    );
  }, [data, segment]);


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

  return (
    <div className="receipts-details">
      <h1>Receipt Details</h1>
      {data ? (
        <div className="receipts-details_comp">
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

    </div>
  );
};

export default Dynamic;
