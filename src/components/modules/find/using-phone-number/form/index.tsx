"use client";
import React, { useState } from "react";
import { TextInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  fetchTransactionsUsingPhoneNumber,
  FetchTransactionsUsingPhoneNumberRequest,
} from "@/src/services/findServices";
import "./style.scss";
import { TbSearch } from "react-icons/tb";
import { useMutation } from "@tanstack/react-query";

const Form = ({ setTicketsData, setSearched }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FetchTransactionsUsingPhoneNumberRequest>({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      phone_number: "",
      page: 1,
      limit: 5,
    },
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: (data: FetchTransactionsUsingPhoneNumberRequest) => {
      return fetchTransactionsUsingPhoneNumber(data);
    },
    mutationKey: ["fetch_transactions"],
    onSuccess: (data) => {
      setTicketsData(data?.response_data);
      setSearched(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<FetchTransactionsUsingPhoneNumberRequest> = (data) => {
    try {
      mutate(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form className="find-ticket" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Phone Number"
          input_icon={<TbSearch />}
          type="number"
          name="phone_number"
          placeholder="Enter Taxpayer Phone Number"
          register={register}
          validation={{
            required: "Phon Number is Required",
            minLength: {
              value: 11,
              message: "Length must be above 11 characters",
            },
            maxLength: {
              value: 11,
              message: "Length must be below 13 characters",
            },
          }}
          error={errors.phone_number}
        />

        <Button text={"Search Tickets"} loading={isPending} />
      </form>
    </>
  );
};

export default Form;
