"use client";
import React from "react";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import {
  verifyTicket,
  VerifyTicketPayload,
} from "@/src/services/verifyTickets";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const VerifyTicketsFrom = ({ userData, setDetails }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerifyTicketPayload>({
    defaultValues: {
      verifyType: "",
      referenceID: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: VerifyTicketPayload) => verifyTicket(data),
    onSuccess: (data: any) => {
      const res = data?.data?.data;
      console.log("data", res);
      if (data?.status == 200) {
        if (res?.response_code == "00") {
          setDetails(res);
          toast.success("Ticket verified successfully");
        } else {
          res.response_code == "99" &&
            setDetails(null) &&
            toast.error(res.response_message);
          res.response_code == "97" &&
            setDetails(res) &&
            toast.error(res.response_message ?? "No ticket for today");
        }
      } else {
        return;
      }
      reset();
      return;
    },
    onError: (error: any) => {
      toast.error(error);
      // setDetails(error.data);
      console.log(error);
      return error;
    },
  });

  const onSubmit = (data: VerifyTicketPayload) => {
    mutation.mutate({ ...data, agentEmail: userData?.email });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="verify-tickets-form">
      <SelectInput
        label="Reference Type"
        name="verifyType"
        id="verifyType"
        register={register}
        options={[
          { label: "Plate Number", value: "plate_number" },
          { label: "Payment Reference", value: "payment_ref" },
          { label: "Emblem", value: "emblem" },
        ]}
        placeholder="Select Reference Type"
      />
      <FormTextInput
        label="Reference Number"
        type="text"
        name="referenceID"
        placeholder="Enter Reference Number"
        register={register}
        validation={{
          required: true,
          minLength: {
            value: 7,
            message: "Length must be above 11 characters",
          },
        }}
        error={errors.referenceID}
      />
      <Button text="Verify Ticket" loading={mutation.isPending} />
    </form>
  );
};

export default VerifyTicketsFrom;
