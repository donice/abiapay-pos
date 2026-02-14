"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { CustomHeader } from "@/src/components/common/header";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { useForm } from "react-hook-form";
import { Button, CancelButton } from "@/src/components/common/button";
import {
  fetchABSSINInfoWIthPhone,
  fetchLGAData,
} from "@/src/services/common";
import { useMutation, useQuery } from "react-query";
import { isBrowser } from "@/src/utils/isBrowser";
import CustomDialog from "@/src/components/common/modal/CustomDialog";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { useDebounce } from "@/src/hooks/useDebounce";
import toast from "react-hot-toast";
import FaceCam from "@/src/components/modules/identity/create/infant/faceCam";
import axiosInstance from "@/src/lib/axiosInstance";

const CreateInfantAbssinModule = () => {
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
  } | null>();

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("USER_DATA");
      if (data) {
        try {
          setUserData(JSON.parse(data));
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData({});
        }
      }
    }
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ImpoundmentProps>({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      plate_number: "",
      amount: 0,
      vehicle_image_base64: "",
      driver_abssin: "",
      driver_name: "",
      driver_phone_number: "",
      vehicle_color: "",
      incident_location: "",
      geohash: "",
      taskforce_name: "",
      lga_zone: "",
      supervisor_name: "",
      vehicle_owner_phone_number: "",
      impound_reason: "",
    },
  });

  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (base64Image: string) => {
    setCapturedImage(base64Image);
  };

  const { data: lgaData } = useQuery({
    queryKey: ["lgaData"],
    queryFn: () => fetchLGAData(),
  });

  console.log("lgaData", lgaData);
  const phone = watch("driver_phone_number");
  const debouncedPhoneNumber = useDebounce(phone, 500);

  useEffect(() => {
    if (debouncedPhoneNumber) {
      const getAbssinDetails = async (phone: string) => {
        try {
          const response = await fetchABSSINInfoWIthPhone({ phone: phone });
          console.log("response", response);
          if (response.response_data.length !== 0) {
            toast.success(response.message ?? "ABSSIN information fetched");
            setValue("driver_abssin", response.response_data.state_id);
            setValue("driver_name", response.response_data.first_name + " " + response.response_data.surname);
          }
        } catch (error) {
          toast.error("Error fetching ABSSIN information");
        }
      };

      getAbssinDetails(debouncedPhoneNumber);
    }
  }, [debouncedPhoneNumber, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ImpoundmentProps) => {
      const res = axiosInstance.post("/impoundment/impound-vehicle", data);
      return res;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.response_message ?? "Error");
    },

    onSuccess: (data: any) => {
      console.log("data", data);
      (
        document.getElementById("createImpoundment") as HTMLDialogElement
      )?.showModal();
    },
  });

  const onSubmit = (data: ImpoundmentProps) => {
    console.log("data", data);
    mutate({ ...data, vehicle_image_base64: capturedImage || "" });
  };

  return (
    <section>
      <CustomHeader
        title="Create Impoundment Form"
        desc={"Ensure to fill all important fields with (*)"}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="app-container">
          <FaceCam onCapture={handleCapture} />
          {capturedImage && (
            <div className="captured-image mt-4">
              <h2 className="text-lg font-semibold mb-2">Image:</h2>
              <img
                src={capturedImage}
                alt="Captured"
                className="border rounded-lg"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}
        </div>

        <FormTextInput
          label={"Vehicle Color"}
          name={"vehicle_color"}
          placeholder="Enter Vehicle Color"
          register={register}
          validation={{ required: true }}
          error={errors.vehicle_color}
        />
        <FormTextInput
          label={"Vehicle Plate Number"}
          name={"plate_number"}
          placeholder="Enter Vehicle Plate Number"
          register={register}
          validation={{ required: true }}
          error={errors.plate_number}
        />

        <SelectInput
          label="LGA"
          placeholder="LGA"
          name={"lga_zone"}
          register={register}
          validation={{ required: true }}
          error={!!errors.lga_zone}
          id={"lga_zone"}
          options={
            lgaData
              ? lgaData?.data.map((lga: any) => ({
                label: lga.lgaName,
                value: lga.lgaID,
              }))
              : []
          }
        />

        <FormTextInput
          label="Driver's Phone Number"
          placeholder="Driver's Phone Number"
          name={"driver_phone_number"}
          register={register}
          validation={{
            required: true,
            pattern: {
              value: /^\d{11}$/,
              message: "Phone number must be 11 digits",
            },
          }}
          error={errors.driver_phone_number}
        />
        <FormTextInput
          label="Driver's Name"
          placeholder="Driver's Name"
          name={"driver_name"}
          register={register}
          validation={{
            required: true,
          }}
          error={errors.driver_name}
        />
        <FormTextInput
          label="Driver's ABSSIN"
          placeholder="Driver's ABSSIN"
          name={"driver_abssin"}
          register={register}
          validation={{
            required: true,
          }}
          error={errors.driver_abssin}
        />

        <FormTextInput
          label="Vehicle Owner's Number"
          placeholder="Vehicle Owner's Number"
          name={"vehicle_owner_phone_number"}
          register={register}
          validation={{
            required: true,
          }}
          error={errors.vehicle_owner_phone_number}
        />

        <FormTextInput
          label="Taskforce's Name"
          placeholder="Taskforce's Name"
          name={"taskforce_name"}
          register={register}
          validation={{
            required: true,
          }}
          error={errors.taskforce_name}
        />

        <FormTextInput
          label="Supervisor's Name"
          placeholder="Supervisor's Name"
          name={"supervisor_name"}
          register={register}
          validation={{
            required: true,
          }}
          error={errors.supervisor_name}
        />

        <SelectInput
          label="Reason for Impoundment"
          placeholder="Reason for Impoundment"
          name={"impound_reason"}
          register={register}
          validation={{ required: true }}
          error={!!errors.impound_reason}
          id={"impound_reason"}
          options={[
            { label: "Obstruction", value: "Obstruction" },
            { label: "One way", value: "One way" },
            { label: "Restriction Violation", value: "Restriction Violation" },
          ]}
        />

        <SelectInput
          label="Incident Location"
          placeholder="Incident Location"
          name={"incident_location"}
          register={register}
          validation={{ required: true }}
          error={!!errors.incident_location}
          id={"incident_location"}
          options={
            lgaData
              ? lgaData?.data.map((lga: any) => ({
                label: lga.lgaName,
                value: lga.lgaID,
              }))
              : []
          }
        />

        <Button text="Submit" loading={isPending} disabled={isPending} />
      </form>
      <CustomDialog
        id="createImpoundment"
        onClose={() =>
          (
            document.getElementById("createImpoundment") as HTMLDialogElement
          )?.close()
        }
      >
        <div className="flex gap-1 items-center justify-center flex-col text-center">
          <TbRosetteDiscountCheckFilled className="text-green-600 text-7xl" />
          <h1 className="text-lg font-semibold">Created Successfully</h1>
          <p className="text-xs md:text-sm text-gray-400 max-w-[14rem]">
            You have successfully listed an impoundment
          </p>
          <div className="w-full grid grid-cols-2 gap-2 mt-4">
            <CancelButton link={"/impoundment"} />
            <Button
              text="Create New"
              onClick={() => {
                (
                  document.getElementById(
                    "createImpoundment"
                  ) as HTMLDialogElement
                )?.close();
                reset();
              }}
            />
          </div>
        </div>
      </CustomDialog>
    </section>
  );
};

export default CreateInfantAbssinModule;

type ImpoundmentProps = {
  merchant_key: string;
  plate_number: string;
  amount: number;
  vehicle_image_base64: string;
  driver_abssin: string;
  driver_name: string;
  driver_phone_number: string;
  vehicle_color: string;
  incident_location: string;
  geohash: string;
  taskforce_name: string;
  lga_zone: string;
  supervisor_name: string;
  vehicle_owner_phone_number: string;
  impound_reason: string;
};
