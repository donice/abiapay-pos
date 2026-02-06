"use client";
import React from "react";
import { TextInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { SubmitHandler, useForm } from "react-hook-form";
import "./style.scss";
import { TbSearch } from "react-icons/tb";
import { useMutation } from "@tanstack/react-query";
import {
  verifyVehicleEnumeration,
  verifyVehicleEnumrationPayload,
} from "@/src/services/vehicleStatusService";
import toast from "react-hot-toast";

const Form = ({ setTicketsData, setSearched }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<verifyVehicleEnumrationPayload>({
    defaultValues: {
      plate_number: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: verifyVehicleEnumrationPayload) => {
      return verifyVehicleEnumeration(data);
    },

    onSuccess: (data: any) => {
      console.log(data);

      if (data?.status == true) {
        setTicketsData(data?.data);
        setSearched(true);
      } else {
        toast.error(data?.response_message);
        setSearched(true);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (data: any) => {
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

        <Button text={"Search for Enumeration"} loading={isPending} />
      </form>
    </>
  );
};

export default Form;
