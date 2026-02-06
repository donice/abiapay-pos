"use client";
import React, { useState } from "react";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { FieldError, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  verifyPlateNumber,
  VerifyPlateNumberType,
} from "@/src/services/transportEnumerationService";
import toast from "react-hot-toast";
import {
  ErrorModal,
  InfoModal,
  VehicleCheckSuccessModal,
} from "@/src/components/common/modal";
import "../style.scss";
import { CustomHeader } from "@/src/components/common/header";

const SignageCategoryComponent = ({}: any) => {
  const [modalDetails, setModalDetails] = useState({
    vehicle_make: "",
    vehicle_model: "",
    vehicle_color: "",
    state_of_registration: "",
    expiry_date: "",
    size_in_meters: "",
    size_in_feet: "",
    premium_zone_rate: "",
    standard_zone_rate: "",
  });
  const [show, setShow] = useState({
    mode: false,
    user: "",
    status: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      amount: "",
      signage_category: "",
      trade_union: "",
      operating_park: "",
      size_in_meters: "",
      size_in_feet: "",
      premium_zone_rate: "",
      standard_zone_rate: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: VerifyPlateNumberType) => {
      return verifyPlateNumber(data);
    },
    mutationKey: ["verify_plate_number"],
    onSuccess: (data) => {
      console.log("FIRST LOG", data);
    },
    onError: (error) => {
      toast.error("Error Verifying Plate Number");
      reset();
      console.log(error);
    },
  });

  const onSubmit = (reqData: any) => {
    mutate(reqData);
  };

  return (
    <div>
      <CustomHeader title="Create Signage Rate" desc="Signage Details" />
      <form onSubmit={handleSubmit(onSubmit)} className="absaa-form">
        <SelectInput
          label="Signage Category"
          name="signage_category"
          id="signage_category"
          options={[
            {
              label: "Select Signage Category",
              value: "",
            },
            {
              label: "Wall Signs",
              value: "Wall Signs",
            },
            {
              label: "Free Standing",
              value: "Free Standing",
            },
          ]}
          placeholder="Select Signage Category"
          register={register}
          validation={{ required: true }}
        />

        <SelectInput
          label="Road Category"
          name="road_category"
          id="road_category"
          options={[
            {
              label: "Select Road Category",
              value: "",
            },
            {
              label: "Premium",
              value: "Premium",
            },
            {
              label: "Azikwe Street",
              value: "Azikwe Street",
            },
          ]}
          placeholder="Select Road Category"
          register={register}
          validation={{ required: true }}
        />

        <SelectInput
          label="Road"
          name="road_name"
          id="road_name"
          options={[
            {
              label: "Select Road",
              value: "",
            },
            {
              label: "Azikwe Road",
              value: "Azikwe Road",
            },
            {
              label: "Azikwe Street",
              value: "Azikwe Street",
            },
          ]}
          placeholder="Select Road"
          register={register}
          validation={{ required: true }}
        />

        <FormTextInput
          label="Size in Meters"
          type="number"
          name="size_in_meters"
          placeholder="Enter Size in Meters"
          register={register}
          validation={{
            required: true,
          }}
          error={errors.size_in_meters as FieldError}
        />

        <FormTextInput
          label="Size in Feet"
          type="number"
          name="size_in_feet"
          placeholder="Enter Size in Feet"
          register={register}
          validation={{
            required: true,
          }}
          error={errors.size_in_feet as FieldError}
        />

        <FormTextInput
          label="Size in Meters"
          type="number"
          name="size_in_meters"
          placeholder="Enter Size in Meters"
          register={register}
          validation={{
            required: true,
          }}
          error={errors.size_in_meters as FieldError}
        />

        <FormTextInput
          label="Premium Zone Rate"
          type="number"
          name="premium_zone_rate"
          placeholder="Enter Premium Zone Rate"
          register={register}
          validation={{
            required: true,
          }}
          error={errors.premium_zone_rate as FieldError}
        />

        <FormTextInput
          label="Standard Zone Rate"
          type="number"
          name="standard_zone_rate"
          placeholder="Enter Standard Zone Rate"
          register={register}
          validation={{
            required: true,
          }}
          error={errors.standard_zone_rate as FieldError}
        />

        <SelectInput
          label="Status"
          name="road_name"
          id="road_name"
          options={[
            {
              label: "Select Status",
              value: "",
            },
            {
              label: "Active",
              value: "Active",
            },
            {
              label: "Inactive",
              value: "Inactive",
            },
          ]}
          placeholder="Select Road"
          register={register}
          validation={{ required: true }}
        />

        <Button text="Pay now" loading={isPending} />
      </form>

      {show.mode === true && (
        <ErrorModal
          text_header={`Error Validating ${show.user} ABSSIN`}
          button_text="Create ABSSIN"
          link="/identity/create/individual/verify"
          text_info={`To proceed, kindly click "Create ABSSIN" to create ${show.user} ABSSIN`}
          status={"error"}
        />
      )}
      {show.mode && show.status == "error" && (
        <InfoModal
          status={show.status}
          text_header="Vehicle Information Not Found"
          button_text="Enter Vehicle Details"
          link="/enumeration/transport/save"
          text_info={`Cannot Proceed. Please Register Vehicle Details`}
        />
      )}
      {show.mode && show.status == "success" && (
        <VehicleCheckSuccessModal
          text_header="Information Retrieved Successfully"
          vehicle_make={modalDetails.vehicle_make}
          vehicle_model={modalDetails.vehicle_model}
          vehicle_color={modalDetails.vehicle_color}
          state_of_registration={modalDetails.state_of_registration}
          expiry_date={modalDetails.expiry_date}
          button_text="Continue"
          onClick={() => {
            setShow({ mode: false, status: "", user: "" });
          }}
        />
      )}
    </div>
  );
};

export default SignageCategoryComponent;
