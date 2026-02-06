"use client";
import { Button } from "@/src/components/common/button";
import React from "react";
import { LuUser } from "react-icons/lu";
import { FormTextInput } from "@/src/components/common/input";
import "../style.scss";
import {
  saveContact,
  SaveContactType,
} from "@/src/services/transportEnumerationService";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const OwnerData = ({ setStage, details, formData }: any) => {

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SaveContactType) => {
      return saveContact(data);
    },
    mutationKey: ["save_contact"],
    onSuccess: (data) => {
      toast.success(data?.response_message || "Owner's data saved successfully");
      setStage(2);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error Saving Owner's data");
    },
  });

  const onSubmit = (reqData: any) => {
    mutate(reqData);
  };

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      name: details?.vehicle_owner.ownerName || "",
      phone: details?.vehicle_owner.phoneNumber || "",
      plate_number: formData.plate_number || "",
      contact_type: "owner",
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="enumeration-form">
      <div className="user-image">
        {details?.vehicle_owner?.photoUrl ? (
          <img src={details?.vehicle_owner?.photoUrl} alt="" />
        ) : (
          <LuUser className="user" />
        )}
      </div>
      <FormTextInput
        label={"Owner's ABSSIN"}
        name={"abssin"}
        value={details?.vehicle_owner.abssin || ""}
      />
      <FormTextInput
        label={"Owner's Name"}
        name={"name"}
        register={register}
        value={details?.vehicle_owner.ownerName || ""}
      />
      <FormTextInput
        label={"Owner's Address"}
        name={"ownerAddress"}
        value={details?.vehicle_owner.ownerAddress || ""}
      />
      <FormTextInput
        label={"Phone Number"}
        name={"phone"}
        register={register}
        value={details?.vehicle_owner.phoneNumber || ""}
      />

      <div className="button-container">
        <button className="button secondary" onClick={() => setStage(0)}>
          Go Back
        </button>
        <Button text="Save & Continue" loading={isPending}/>
      </div>
    </form>
  );
};

export default OwnerData;
