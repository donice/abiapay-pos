"use client";
import { usePathname, useRouter } from "next/navigation";
import { getLastPathSegment } from "@/src/utils/getLastPathSegment";
import React, { useEffect, useState } from "react";
import { SelectInput } from "@/src/components/common/input";
import { BackButton, Button } from "@/src/components/common/button";
import "./style.scss";
import { formatAmount } from "@/src/utils/formatAmount";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateTicketPayload } from "@/src/components/types/ticketTypes";
import { getCurrentDateTime } from "@/src/utils/getCurrentDateTime";
import { randomInvoiceGenerator } from "@/src/utils/randomInvoiceGenerator";
import { useMutation } from "@tanstack/react-query";
import { createNewTicket } from "@/src/services/ticketsServices";
import toast from "react-hot-toast";
import { getErrorMessages } from "@/src/utils/helper";
import { isBrowser } from "@/src/utils/isBrowser";

const Dynamic = () => {
  const router = useRouter();
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
    (ticket: any) => ticket.registrationNumber == segment
  );


  return (
    <div className="ticket-details">
      <h1>Vehicle Details</h1>
      <div className="ticket-details_comp">
        <div>
          <p>Registration Number</p>
          <p>{ticket[0]?.registrationNumber}</p>
        </div>

        <div>
          <p>Phone</p>
          <p>{ticket[0]?.phone}</p>
        </div>

        <div>
          <p>Owner Name</p>
          <p>{ticket[0]?.ownerName}</p>
        </div>

        <div>
          <p>Vehicle Make</p>
          <p>{ticket[0]?.vehicleMake}</p>
        </div>

        <div>
          <p>Vehicle Model</p>
          <p>{ticket[0]?.vehicleModel}</p>
        </div>

        <div>
          <p>Engine Number</p>
          <p>{ticket[0]?.engineNumber}</p>
        </div>

        <div>
          <p>Chassis Number</p>
          <p>{ticket[0]?.chassisNumber}</p>
        </div>

        <div>
          <p>Owner Address</p>
          <p>{ticket[0]?.ownerAddress}</p>
        </div>

        <div>
          <p>Vehicle Status</p>
          <p>{ticket[0]?.vehicleStatus}</p>
        </div>

        <div>
          <p>Vehicle Color</p>
          <p>{ticket[0]?.vehicleColor}</p>
        </div>

        <div>
          <p>State of Registration</p>
          <p>{ticket[0]?.stateOfRegistration}</p>
        </div>

        <div>
          <p>Expiry Date</p>
          <p>{ticket[0]?.expiryDate}</p>
        </div>

        <div>
          <p>Asset Code</p>
          <p>{ticket[0]?.assetCode}</p>
        </div>
      </div>

      <Button text={"Back"} onClick={() => router.back()} />
    </div>
  );
};

export default Dynamic;
