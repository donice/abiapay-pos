"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  saveVehicleDetails,
  SaveVehicleDetailsProps,
} from "@/src/services/transportEnumerationService";
import toast from "react-hot-toast";
import { InfoModal } from "@/src/components/common/modal";
import { CustomHeader } from "@/src/components/common/header";
import "../style.scss";
import { fetchStates } from "@/src/services/common";

const SaveVehicleDetailsComponent = () => {
  const [state, setState] = useState([]);
  const [formData, setFormData] = useState({
    vehicleStatus: "",
    state_of_registration: "",
  });

  const [show, setShow] = useState({
    mode: false,
    status: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      plate_number: "",
      owner_phone_number: "",
      vehicle_make: "",
      vehicle_model: "",
      engine_number: "",
      chassis_number: "",
      owner_name: "",
      owner_address: "",
      vehicleStatus: "",
      vehicle_color: "",
      state_of_registration: "",
      expiry_date: "",
    },
  });

  const getStates = async () => {
    try {
      const data = await fetchStates();
      setState(
        data?.data.map((item: any) => {
          return {
            label: item.state,
            value: item.state,
          };
        })
      );
      console.log(state);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStates();
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SaveVehicleDetailsProps) => {
      return saveVehicleDetails({
        ...data,
        vehicleStatus: formData.vehicleStatus,
        state_of_registration: formData.state_of_registration,
      });
    },
    mutationKey: ["save_plate_number"],
    onSuccess: (data) => {
      console.log(data);
      if (data.response == "00") {
        toast.success(data.response_message || "Plate Number Verified Successfully");
        setShow({ mode: true, status: "success" });
        console.log(show);
      } else {
        toast.error("Error Verifying Plate Number");
        setShow({ mode: true, status: "error" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const onSubmit = (reqData: any) => {
    mutate(reqData);
    console.log(reqData);
    // setStage(1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    console.log(formData);
  };

  return (
    <div>
      <CustomHeader
        title="Vehicle Details"
        desc={"Enter Correct Vehicle Details"}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="enumeration-form">
        <FormTextInput
          label="Plate Number"
          type="text"
          name="plate_number"
          placeholder="Enter Vehicle's Plate Number"
          register={register}
          validation={{ required: true }}
          error={errors.plate_number}
        />
        <FormTextInput
          label="Phone Number (e.g 08123456789)"
          type="number"
          name="owner_phone_number"
          placeholder="Enter Owner's Phone Number"
          register={register}
          validation={{ required: true }}
          error={errors.owner_phone_number}
        />
        <FormTextInput
          label="Owner's Name"
          type="text"
          name="owner_name"
          placeholder="Enter Owner's Owner's Name"
          register={register}
          validation={{ required: true }}
          error={errors.owner_name}
        />
        <FormTextInput
          label="Owner's Address"
          type="text"
          name="owner_address"
          placeholder="Enter Owner's Owner's Address"
          register={register}
          validation={{ required: true }}
          error={errors.owner_address}
        />
        <FormTextInput
          label="Vehicle Make"
          type="text"
          name="vehicle_make"
          placeholder="Enter Owner's Vehicle Make"
          register={register}
          validation={{ required: true }}
          error={errors.vehicle_make}
        />
        <FormTextInput
          label="Vehicle Model"
          type="text"
          name="vehicle_model"
          placeholder="Enter Owner's Vehicle Model"
          register={register}
          validation={{ required: true }}
          error={errors.vehicle_model}
        />
        <SelectInput
          label="Vehicle Status"
          name="vehicleStatus"
          id="vehicleStatus"
          onChange={handleChange}
          options={[
            { label: "Select Vehicle Status", value: "" },
            { label: "Active", value: "active" },
            { label: "Default", value: "default" },
          ]}
          placeholder="Select Vehicle Status"
        />
        <FormTextInput
          label="Vehicle Color"
          type="text"
          name="vehicle_color"
          placeholder="Enter Owner's Vehicle Color"
          register={register}
          validation={{ required: true }}
          error={errors.vehicle_color}
        />
        <FormTextInput
          label="Engine Number"
          type="text"
          name="engine_number"
          placeholder="Enter Owner's Engine Number"
          register={register}
          validation={{ required: true }}
          error={errors.engine_number}
        />
        <FormTextInput
          label="Chassis Number"
          type="text"
          name="chassis_number"
          placeholder="Enter Owner's Chassis Number"
          register={register}
          validation={{ required: true }}
          error={errors.chassis_number}
        />
        <SelectInput
          label="Registration State"
          name="state_of_registration"
          id="state_of_registration"
          onChange={handleChange}
          options={
            [{ label: "Select Registration State", value: "" }, ...state]
          }
          placeholder="Select Registration State"
        />
        <FormTextInput
          label="Vehicle Expiry Date"
          type="date"
          name="expiry_date"
          placeholder="Enter Owner's Expiry Date"
          register={register}
          validation={{ required: true }}
          error={errors.expiry_date}
        />

        <Button text="Save & Continue" loading={isPending} />
      </form>

      {show.mode && show.status == "success" && (
        <InfoModal
          status={show.status}
          text_header="Vehicle Details Saved Successfully"
          button_text="Enumerate Vehicle"
          link="/enumeration/transport"
          text_info={`You can now proceed to Enumerate your Vehicle`}
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
    </div>
  );
};

export default SaveVehicleDetailsComponent;
