"use client";

import { FormTextInput, SelectInput } from "@/src/components/common/input";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchProducts } from "@/src/services/common";
import {  createTrafficoffence, Offences } from "@/src/services/trafficOffences";
import { Product } from "@/src/services/ticketsServices";
import "./style.scss";
import { BackButton, Button } from "@/src/components/common/button";
import toast from "react-hot-toast";
import { CreateOffencePayload } from "@/src/services/trafficOffences";
import { getCurrentDateTime } from "@/src/utils/getCurrentDateTime";
import { useMutation } from "react-query";
import { fetchPlateNumberInfo } from "@/src/services/ticketsServices";
import { useDebounce } from "@/src/hooks/useDebounce";
import { fetchAllOffences } from "@/src/services/trafficOffences";
import { useRouter } from "next/navigation";
import { bankOptions } from "@/src/lib/app";

const AddTrafficOffenceTicketForm = ({
  setSelectedType,
  setSelectedVehicleType,
}: any) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      amount: "",
  plate_number: "",
  vehicle_type: "",
  taxpayer_name: "",
  taxpayer_phone: "",
  offence_type: "",
      wallet_type: "fidelity",
    },
  });
  const router = useRouter();

  const [offences, setOffences] = React.useState<Offences[]>([]);
  const [vehicles, setVehicles] = React.useState<Product[]>([]);

  const getOffences = async () => {
    try {
      const response = await fetchAllOffences();
      setOffences(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductsData = async () => {
    try {
      const response = await fetchProducts();
      setVehicles(response?.data);
    } catch {
      toast.error("Error fetching Vehicles");
    }
  };

  useEffect(() => {
    getOffences();
    getProductsData();
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateOffencePayload) => {
        console.log(data)
      return createTrafficoffence(data);
    },
    onSuccess: (response: any) => {
      if (response.responseCode === "00") {
        toast.success(response.message);
        router.push("/traffic-offence/traffic-ticket-history");
        // setPaymentRef(response.payment_ref);
        // setShow(true);
      } else if (response.response_code === "74") {
        toast.error(response.message);
        // router.push("/tickets/transport");
      } else {
        toast.error(`${response.response_message}, Try again`);
      }
    },
    onError: () => {
      toast.error("Error Creating Ticket");
    },
  });

  const onSubmit = async (data: CreateOffencePayload) => {
    const formData = {
      ...data,
      transaction_date: getCurrentDateTime(),
    };

    sessionStorage.setItem("TRAFFIC_OFFENCE", JSON.stringify(formData));

    mutate(formData);
  };

  const plateNumber = watch("plate_number");
    const debouncedPlateNumber = useDebounce(plateNumber, 500);

  useEffect(() => {
    if (debouncedPlateNumber) {
      const getPlateNumberInfo = async (plateNumber: string) => {
        try {
          const response = await fetchPlateNumberInfo(plateNumber);

          if (response.data?.length !== 0) {
            toast.success(response.message);
            setValue("taxpayer_name", response.data.Name);
            setValue("taxpayer_phone", response.data.Phone);
          }
        } catch (error) {
          toast.error("Error fetching plate number information");
        }
      };

      getPlateNumberInfo(debouncedPlateNumber);
    }
  }, [debouncedPlateNumber, setValue]);

  const offenceType = watch("offence_type");

  useEffect(() => {
    if (offenceType) {
      const selectedOffence = offences.find((off) => off.id === Number(offenceType));
      if (selectedOffence) {
        setValue("amount", String(selectedOffence.fee));
      }
    }
  }, [offenceType, offences, setValue]);



  return (
    <form className="add-offence" onSubmit={handleSubmit(onSubmit)}>
      <SelectInput
        label="Select Verification Type"
        name="offence_type"
        id="offence_type"
        register={register}
        validation={{
          required: true,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
            // setOffences(e.target.value);
          },
        }}
        options={offences.map((offences) => ({
          value: offences.id,
          label: offences.title,
        }))}
        placeholder="Select Offence"
        //   error={!!errors.productCode}
      />

      <SelectInput
        label="Vehicle Type"
        name="vehicle_type"
        id="vehicle_type"
        register={register}
        validation={{
          required: true,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedVehicleType(e.target.value);
          },
        }}
        options={vehicles.map((vehicles) => ({
          value: vehicles.productCode,
          label: vehicles.productName,
        }))}
        placeholder="Select Ticket Type"
        //   error={!!errors.productCode}
      />

      <FormTextInput
        label="Plate Number"
        type="text"
        name="plate_number"
        placeholder="Enter Plate Number"
        register={register}
        validation={{
          required: true,
          setValueAs: (value: string) => value.toUpperCase(),
        }}
        error={errors.plate_number}
      />

      <FormTextInput
        label="Taxpayer Phone Number"
        type="number"
        name="taxpayer_phone"
        placeholder="Enter Taxpayer Phone Number"
        register={register}
        validation={{
          required: "Field Required",
          minLength: {
            value: 11,
            message: "Length must be above 11 characters",
          },
          maxLength: {
            value: 11,
            message: "Length must be below 13 characters",
          },
        }}
        error={errors.taxpayer_phone}
      />

      <FormTextInput
        label="Taxpayer Name"
        type="text"
        name="taxpayer_name"
        placeholder="Enter Taxpayer Name"
        register={register}
        validation={{ required: true }}
        error={errors.taxpayer_name}
      />

      <FormTextInput
        label="Amount"
        type="number"
        name="amount"
        placeholder="Enter Amount"
        register={register}
        readOnly
        validation={{ required: true }}
        error={errors.amount}
      />

      <SelectInput
        label="Choose Wallet"
        name="wallet_type"
        id="wallet_type"
        register={register}
        validation={{ required: true }}
        options={bankOptions}
        placeholder="Select Wallet Type"
        error={!!errors.wallet_type}
      />

      <div className="btn_container">
        <BackButton link="/traffic-offence" />
        <Button text="Create Ticket" loading={isPending} />
      </div>
    </form>
  );
};

export default AddTrafficOffenceTicketForm;

function mutate(formData: any) {
  throw new Error("Function not implemented.");
}
