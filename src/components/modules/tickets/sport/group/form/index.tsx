"use client";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import React from "react";
import "../style.scss";
import { useForm } from "react-hook-form";
import { createGroupSportTicket } from "@/src/services/ticketsServices";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessages } from "@/src/utils/helper";
import { CreateGroupSportPayload } from "@/src/components/types/ticketTypes";

const Form = ({ setShow, category }: { setShow: any; category: string }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      team_name: "",
      taxpayer_phone: "",
      taxpayer_name: "",
      ticket_type: "",
      wallet_type: "",
      amount: "",
      stadium_name: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateGroupSportPayload) => {
      return createGroupSportTicket(data);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.data.response_code) {
        data?.data.response_code == "00"
          ? toast.success(data?.data?.response_message) &&
            setShow({
              mode: true,
              message: data?.data.response_message,
              expiry_date: "",
              payment_ref: data?.data?.payment_ref,
            })
          : toast.error(data?.data.response_message);
      } else {
        toast.error(getErrorMessages(data?.data.response_message));
      }
    },
    onError: (error) => {
      toast.error("Unable to create loading offloading request");
      console.log(error);
    },
  });

  const onSubmit = (reqData: any) => {
    mutate(reqData);
    // console.log(reqData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="loading_form">
      <FormTextInput
        label={"Taxpayer Phone Number"}
        name={"taxpayer_phone"}
        placeholder="Enter Taxpayer Phone Number"
        register={register}
        validation={{ required: true }}
        error={errors.taxpayer_phone}
      />
      <FormTextInput
        label={"Taxpayer Name"}
        name={"taxpayer_name"}
        placeholder="Enter Taxpayer Name"
        register={register}
        validation={{ required: true }}
        error={errors.taxpayer_name}
      />

      <SelectInput
        label={"Stadium Name"}
        name={"stadium_name"}
        id={"stadium_name"}
        register={register}
        validation={{ required: true }}
        error={!!errors.stadium_name}
        options={[
          { label: "Enyimba Stadium, Aba", value: "Enyimba Stadium, Aba" },
          {
            label: "Umuahia Township Stadium, Umuahia",
            value: "Umuahia Township Stadium, Umuahia",
          },
        ]}
      />
      <SelectInput
        label={"Team Name"}
        name={"team_name"}
        id={"team_name"}
        register={register}
        validation={{ required: true }}
        error={!!errors.stadium_name}
        options={[
          { label: "Enyimba FC, Aba", value: "Enyimba FC, Aba" },
          {
            label: "Abia Warrior FC, Umuahia",
            value: "Abia Warrior FC, Umuahia",
          },
        ]}
      />
     <SelectInput
        label={"Ticket Type"}
        name={"ticket_type"}
        id={"ticket_type"}
        register={register}
        validation={{ required: true }}
        error={!!errors.stadium_name}
        options={[
          { label: "VIP", value: "VIP" },
          {
            label: "Popular Stand",
            value: "Popular Stand",
          },
        ]}
      />
      <FormTextInput
        label={"Amount"}
        name={"amount"}
        placeholder="Enter Amount"
        value={category === "guest" ? "1200" : "1000"}
        register={register}
        validation={{ required: true }}
        error={errors.amount}
        disabled
      />

      <SelectInput
        label={"Wallet Type"}
        name={"wallet_type"}
        id={"wallet_type"}
        register={register}
        validation={{ required: true }}
        error={!!errors.wallet_type}
        options={[
          { label: "Fidelity", value: "fidelity" },
          { label: "Access", value: "access" },
        ]}
      />

      <Button text={"Process Now"} loading={isPending} />
    </form>
  );
};

export default Form;
