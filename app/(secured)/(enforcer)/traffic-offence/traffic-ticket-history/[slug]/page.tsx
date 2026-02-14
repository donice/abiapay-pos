"use client";
import { usePathname } from "next/navigation";
import { getLastPathSegment } from "@/src/utils/getLastPathSegment";
import React, { useMemo, useState, useEffect } from "react";
import "./style.scss";
import { formatAmount } from "@/src/utils/formatAmount";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { Loading } from "@/src/components/common/loader/redirecting";
import { fetchOffenceHistory } from "@/src/services/trafficOffences";
import { isBrowser } from "@/src/utils/isBrowser";
import { useForm } from "react-hook-form";
import { BillPaymentPayload } from "@/src/services/billServices";
import { BackButton } from "@/src/components/common/button";

const Dynamic = () => {
  const path = usePathname();
  const segment = getLastPathSegment(path);
  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("USER_DATA");
      if (data !== null) {
        try {
          const parsedData = JSON.parse(data);
          setUserData(parsedData);
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData(null);
        }
      }
    }
  }, [isBrowser]);

  // Fetching offence history using React Query
  const { data, isError, isLoading } = useQuery({
    queryKey: ["get_offences", userData?.email],
    queryFn: async () => {
      if (!userData?.email) throw new Error("No email provided");
      return fetchOffenceHistory({ email: userData.email });
    },
    enabled: !!userData?.email, // Ensures query runs only when userData.email exists
  });

  if (isError) {
    toast.error("Something went wrong fetching transactions");
    console.log("Error fetching offences");
  }

  // Filtering ticket based on URL segment
  const ticket = useMemo(() => {
    return (data?.data || []).filter(
      (ticket: { payment_reference: string }) => ticket.payment_reference === segment
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
      <h1>Ticket Offence Details</h1>
      {isLoading ? (
        <Loading />
      ) : ticket.length > 0 ? (
        <div className="receipts-details_comp">
          <div>
            <p className="font-bold"> Status</p>
            <p>{ticket[0]?.status || "-"}</p>
          </div>
          {/* <div>
            <p className="font-bold">Occurrence</p>
            <p>{ticket[0]?.occurrence || "-"}</p>
          </div> */}
          <div>
            <p className="font-bold">Amount</p>
            <p>₦{formatAmount(ticket[0]?.amount) || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Plate Number</p>
            <p>{ticket[0]?.plate_number || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Vehicle Type</p>
            <p>{ticket[0]?.vehicle_type || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Offence Type</p>
            <p>{ticket[0]?.offence_type || "-"}</p>
          </div>
          <div>
            <p className="font-bold">TaxPayer Name</p>
            <p>{ticket[0]?.taxpayer_phone || "-"}</p>
          </div>
          <div>
            <p className="font-bold">TaxPayer Name</p>
            <p>{ticket[0]?.taxpayer_phone || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Payment Reference </p>
            <p>{ticket[0]?.payment_reference || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Agent Email</p>
            <p>{ticket[0]?.created_by || "-"}</p>
          </div>
          <div>
            <p className="font-bold">Date Created</p>
            <p>{ticket[0]?.created_at || "-"}</p>
          </div>
        </div>
      ) : (
        <p>No records found</p>
      )}
      <BackButton link={"/traffic-offence/traffic-ticket-history"} />
    </div>
  );
};

export default Dynamic;
