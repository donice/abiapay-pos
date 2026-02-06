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
      <CustomHeader title="Signage Category" desc="Signage Details" />
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
          label="Road Type"
          name="road_type"
          id="road_type"
          options={[
            {
              label: "Select Road Type",
              value: "",
            },
            {
              label: "Premium",
              value: "Premium",
            },
            {
              label: "Standard",
              value: "Standard",
            },
          ]}
          placeholder="Select Road Type"
          register={register}
          validation={{ required: true }}
        />

        <SelectInput
          label="Road Type"
          name="road_type"
          id="road_type"
          options={[
            {
              label: "Select Road Type",
              value: "",
            },
            {
              label: "Premium",
              value: "Premium",
            },
            {
              label: "Standard",
              value: "Standard",
            },
          ]}
          placeholder="Select Road Type"
          register={register}
          validation={{ required: true }}
        />
        <SelectInput
          label="Road Name"
          name="road_name"
          id="road_name"
          options={[
            {
              label: "Select Road Name",
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
          placeholder="Select Road Name"
          register={register}
          validation={{ required: true }}
        />
        <SelectInput
          label="Zone"
          name="zone"
          id="zone"
          options={[
            {
              label: "Select Zone",
              value: "",
            },
            {
              label: "Premium Zone",
              value: "Premium Zone",
            },
            {
              label: "Standard Zone",
              value: "Standard Zone",
            },
          ]}
          placeholder="Select Zone"
          register={register}
          validation={{ required: true }}
        />
        <SelectInput
          label="Size"
          name="size"
          id="size"
          options={[
            {
              label: "Select Size",
              value: "",
            },
            {
              label: "0.1 to 1.0 (2x2 - 3x4)",
              value: "0.1 to 1.0 (2x2 - 3x4)",
            },
            {
              label: "1.01 to 3.0 (4x6 - 5x8)",
              value: "1.01 to 3.0 (4x6 - 5x8)",
            },
            {
              label: "3.01 to 5.0 (6x10 - 6x12)",
              value: "3.01 to 5.0 (6x10 - 6x12)",
            },
            {
              label: "5.01 to 7.0 (6x12 - 8x10)",
              value: "5.01 to 7.0 (6x12 - 8x10)",
            },
            {
              label: "7.01 to 10.0 (8x10 - 10x10)",
              value: "7.01 to 10.0 (8x10 - 10x10)",
            },
            {
              label: "10.01 to 13.0 (10x10 - 10x12)",
              value: "10.01 to 13.0 (10x10 - 10x12)",
            },
            {
              label: "13.01 to 15.0 (10x12 - 10x16)",
              value: "13.01 to 15.0 (10x12 - 10x16)",
            },
            {
              label: "15.01 to 25.0 (10x16 - 10x20)",
              value: "15.01 to 25.0 (10x16 - 10x20)",
            },
            
          ]}
          placeholder="Select Size"
          register={register}
          validation={{ required: true }}
        />
        <FormTextInput
          label="Amount"
          type="number"
          name="amount"
          placeholder="Enter Amount"
          register={register}
          validation={{
            required: true,
          }}
          error={errors.amount as FieldError}
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
