"use client";
import { usePathname } from "next/navigation";
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
import { SuccessModal } from "@/src/components/common/modal";
import { isBrowser } from "@/src/utils/isBrowser";
import { bankOptions } from "@/src/lib/app";

const Dynamic = () => {
  const path = usePathname();
  const [show, setShow] = useState(false);
  const segment = getLastPathSegment(path);
  let fetched_data = isBrowser ? sessionStorage.getItem("TICKETS_DATA") : null;
  const data = fetched_data && JSON.parse(fetched_data);

  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
  } | null>();

  // Check if running in Android bridge app
  const [isAndroidBridge, setIsAndroidBridge] = useState(false);

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

      // Check if HydrogenBridge is available
      setIsAndroidBridge(typeof (window as any).HydrogenBridge !== 'undefined');
    }
  }, []);

  const ticket = data?.filter(
    (ticket: any) => ticket.idagent_transactions == segment
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  useEffect(() => {
    setValue("agentEmail", userData?.email || "");
  }, [userData]);

  // Handle payment result from Hydrogen Bridge
  useEffect(() => {
    if (isBrowser) {
      (window as any).handleHydrogenPaymentResult = (result: any) => {
        console.log('Hydrogen Payment Result:', result);

        if (result.status === 'SUCCESS') {
          toast.success('Payment Successful!');

          // Parse the payment data
          let paymentData;
          try {
            paymentData = typeof result.data === 'string'
              ? JSON.parse(result.data)
              : result.data;
          } catch (e) {
            paymentData = result.data;
          }

          console.log('Payment Data:', paymentData);

          // Get the pending ticket data
          const pendingTicket = sessionStorage.getItem("PENDING_TICKET");
          if (pendingTicket) {
            const ticketData = JSON.parse(pendingTicket);

            // Store payment response
            sessionStorage.setItem("HYDROGEN_PAYMENT", JSON.stringify(paymentData));
            sessionStorage.setItem("TRANSPORT_INVOICE", JSON.stringify(ticketData));

            // Clear pending ticket
            sessionStorage.removeItem("PENDING_TICKET");

            // Show success modal
            setShow(true);
          }

        } else if (result.status === 'CANCELLED') {
          toast.error('Payment Cancelled by user');
          sessionStorage.removeItem("PENDING_TICKET");
        } else if (result.status === 'FAILED') {
          toast.error('Payment Failed: ' + result.data);
          sessionStorage.removeItem("PENDING_TICKET");
        } else if (result.status === 'ERROR') {
          toast.error('Error: ' + result.message);
          sessionStorage.removeItem("PENDING_TICKET");
        }
      };
    }

    // Cleanup
    return () => {
      if (isBrowser) {
        delete (window as any).handleHydrogenPaymentResult;
      }
    };
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateTicketPayload) => {
      sessionStorage.setItem("TRANSPORT_INVOICE", JSON.stringify(data));
      return createNewTicket(data);
    },
    mutationKey: ["fetch_transactions"],
    onSuccess: (data) => {
      data.message && toast.error(getErrorMessages(data.message));
      data.response_code == "00"
        ? toast.success(data.response_message)
        : toast.error(data.response_message);
      setShow(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<CreateTicketPayload> = (data) => {
    try {
      const selectedWallet = data.wallet_type;

      // Check if using Hydrogen payment (Android bridge app)
      if (isAndroidBridge && selectedWallet !== 'fidelity') {
        // Convert amount to kobo (smallest currency unit)
        // If your amount is already in kobo, skip this multiplication
        const amountInKobo = Math.round((Number(data?.amount) ?? 0) * 100);

        // Store ticket data for later (after payment succeeds)
        sessionStorage.setItem("PENDING_TICKET", JSON.stringify(data));

        // Trigger appropriate Hydrogen payment method
        if ((window as any).HydrogenBridge) {
          toast.loading('Launching payment...');

          switch (selectedWallet) {
            case 'card':
            case 'pos':
              (window as any).HydrogenBridge.initiateCardPayment(amountInKobo);
              break;

            case 'breezepay':
              (window as any).HydrogenBridge.initiateBreezePay(amountInKobo);
              break;

            case 'transfer':
            case 'instantpay':
              (window as any).HydrogenBridge.initiateTransfer(amountInKobo);
              break;

            default:
              // Default to card payment
              (window as any).HydrogenBridge.initiateCardPayment(amountInKobo);
          }
        } else {
          toast.error('Hydrogen Bridge not available');
        }
      } else {
        mutate(data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Payment initiation failed');
    }
  };

  return (
    <div className="ticket-details">
      <h1>Ticket Details</h1>

      {/* Show indicator when running in Android app */}
      {isAndroidBridge && (
        <div style={{
          padding: '12px',
          background: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #4caf50'
        }}>
          <p style={{
            margin: 0,
            color: '#2e7d32',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ✓ Mobile App Mode - Hardware payments available
          </p>
        </div>
      )}

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
          <BackButton link={"/find/using-phone-number"} />
        </div>
      </form>
      {show && (
        <SuccessModal
          text="View Receipt"
          maintext="Revend Ticket Successful"
          link="/tickets/transport/add/summary"
          id={`Valid for: ${ticket[0]?.payment_period}, Payment for: ${ticket[0]?.revenue_item} `}
          buttonText="Done"
        />
      )}
    </div>
  );
};

export default Dynamic;