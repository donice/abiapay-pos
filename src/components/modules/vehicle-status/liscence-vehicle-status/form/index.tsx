"use client";
import React from "react";
import { TextInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { SubmitHandler, useForm } from "react-hook-form";
import "./style.scss";
import { TbSearch } from "react-icons/tb";
import { useMutation } from "@tanstack/react-query";
import {
  verifyVehicleStatus,
  verifyVehicleStatusPayload,
} from "@/src/services/vehicleStatusService";
import toast from "react-hot-toast";

const Form = ({ setTicketsData, setSearched }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<verifyVehicleStatusPayload>({
    defaultValues: {
      ref: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["verify_vehicle_status"],
    mutationFn: (data: verifyVehicleStatusPayload) => {
      return verifyVehicleStatus(data);
    },

    onSuccess: (data: any) => {
      console.log(data);

      if (data?.response_code == "00") {
        setTicketsData(data?.response_data);
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
          name="ref"
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
          error={errors.ref}
        />

        <Button text={"Search Tickets"} loading={isPending} />
      </form>
    </>
  );
};

export default Form;
