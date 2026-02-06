"use client";
import React, { useState } from "react";
import { TextInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FetchTransactionsUsingPlateNumberRequest,
  fetchTransactionsUsingPlateeNumber,
} from "@/src/services/findServices";
import "./style.scss";
import { TbSearch } from "react-icons/tb";
import { useMutation } from "@tanstack/react-query";

const Form = ({ setTicketsData, setSearched }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FetchTransactionsUsingPlateNumberRequest>({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      plate_number: "",
      page: 1,
      limit: 5,
    },
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: (data: FetchTransactionsUsingPlateNumberRequest) => {
      return fetchTransactionsUsingPlateeNumber(data);
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

  const onSubmit: SubmitHandler<FetchTransactionsUsingPlateNumberRequest> = (data) => {
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
          label="Plate Number"
          input_icon={<TbSearch />}
          type="text"
          name="plate_number"
          placeholder="Enter Taxpayer Plate Number"
          register={register}
          validation={{
            required: "Plate Number is Required",
            minLength: {
              value: 5,
              message: "Length must be above 11 characters",
            },
            maxLength: {
              value: 8,
              message: "Length must be below 13 characters",
            },
          }}
          error={errors.plate_number}
        />

        <Button text={"Search Tickets"} loading={isPending} />
      </form>
    </>
  );
};

export default Form;
