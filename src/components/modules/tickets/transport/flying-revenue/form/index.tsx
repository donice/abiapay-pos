"use client";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import React, { useEffect, useState } from "react";
import "../style.scss";
import { useForm } from "react-hook-form";
import { useDebounce } from "@/src/hooks/useDebounce";
import { fetchPlateNumberInfo } from "@/src/services/ticketsServices";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessages } from "@/src/utils/helper";
import {
  EmblemProduct,
} from "@/src/services/loadingOffloadingService";
import { haulages } from "../lib/haulages";
import {
  createFlyingRevenue,
  fetchTonnage,
  FlyingRevenuePayload,
} from "@/src/services/FlyingRevenue";

const FlyingRevenueForm = ({
  setShow,
  slug,
}: {
  setShow: any;
  slug: string;
}) => {
  const haulageItem = haulages.find((item) => item.name.includes(slug));
  const [embleProductCode, setEmbleProductCode] = useState<EmblemProduct[]>([]);

  const getEmblemProductCode = async () => {
    try {
      const data = await fetchTonnage(haulageItem?.cat);
      setEmbleProductCode(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEmblemProductCode();
  }, []);

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      penalty_status: "no penalty",
      total_number: "1",
      vehicle_content: "",
      product_code: "",
      category: haulageItem ? haulageItem.cat : "",
      taxPayerPhone: "",
      taxPayerName: "",
      plateNumber: "",
      collection_point: "",
      payment_period: "1Day",
      wallet_type: "fidelity",
      // next_payment_date: "1Day",
      amount: "",
    },
  });

  const plateNumber = watch("plateNumber");
  const debouncedPlateNumber = useDebounce(plateNumber, 500);

  useEffect(() => {
    if (debouncedPlateNumber) {
      const getPlateNumberInfo = async (plateNumber: string) => {
        try {
          const response = await fetchPlateNumberInfo(plateNumber);
          if (response.data.length !== 0) {
            toast.success(response.message);
            setValue("taxPayerName", response.data.Name);
            setValue("taxPayerPhone", response.data.Phone);
          }
        } catch (error) {
          toast.error("Error fetching plate number information");
        }
      };

      getPlateNumberInfo(debouncedPlateNumber);
    }
  }, [debouncedPlateNumber, setValue]);

  const handleEmblemTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedProductCode = event.target.value;
    const selectedProduct: EmblemProduct | undefined = embleProductCode.find(
      (item: EmblemProduct) => item.productCode === selectedProductCode
    );

    if (selectedProduct) {
      setValue("amount", selectedProduct.amount);
    }
    setValue("product_code", selectedProductCode);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FlyingRevenuePayload) => {
      return createFlyingRevenue(data);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.response_code) {
        data?.response_code == "00"
          ? toast.success(data?.response_message) &&
            setShow({
              mode: true,
              message: data?.response_message,
              expiry_date: "",
              payment_ref: data?.payment_ref,
            })
          : toast.error(data?.response_message);
      } else {
        toast.error(getErrorMessages(data?.message));
      }
    },
    onError: (error) => {
      toast.error("Unable to proceed flying revenue request");
      console.log(error);
    },
  });

  const onSubmit = (reqData: any) => {
    mutate(reqData);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="loading_form">
          <>
            <SelectInput
              label={"Vehicle Type"}
              name={"product_code"}
              id={"product_code"}
              validation={{ required: true }}
              options={embleProductCode.map((item: EmblemProduct) => ({
                label: item.productName,
                value: item.productCode,
              }))}
              onChange={handleEmblemTypeChange}
            />
          </>

        <FormTextInput
          label={"Vehicle Content"}
          name={"vehicle_content"}
          placeholder="Enter Vehicle Vehicle Content e.g Sand, Gravel..."
          register={register}
          validation={{ required: true }}
          error={errors.vehicle_content}
        />
        <FormTextInput
          label={"Plate Number"}
          name={"plateNumber"}
          placeholder="Enter Vehicle Plate Number"
          register={register}
          validation={{ required: true }}
          error={errors.plateNumber}
        />
        <FormTextInput
          label={"Taxpayer Phone Number"}
          name={"taxPayerPhone"}
          placeholder="Enter Taxpayer Phone Number"
          register={register}
          validation={{ required: true }}
          error={errors.taxPayerPhone}
        />
        <FormTextInput
          label={"Taxpayer Name"}
          name={"taxPayerName"}
          placeholder="Enter Taxpayer Name"
          register={register}
          validation={{ required: true }}
          error={errors.taxPayerName}
        />
        <FormTextInput
          label={"Collection Point"}
          name={"collection_point"}
          placeholder="Enter Collection Point"
          register={register}
          validation={{ required: true }}
          error={errors.collection_point}
        />
        <FormTextInput
          label={"Amount"}
          name={"amount"}
          placeholder="Enter Amount"
          register={register}
          validation={{ required: true }}
          error={errors.amount}
          disabled
        />
        <SelectInput
          label={"Wallet Type"}
          name={"wallet_type"}
          id={"wallet_type"}
          register={register}
          validation={{ required: true }}
          error={!!errors.wallet_type}
          options={[
            { label: "Fidelity", value: "fidelity" },
            { label: "Access", value: "access" },
          ]}
        />

        <Button text={"Process Now"} loading={isPending} />
      </form>
    </>
  );
};

export default FlyingRevenueForm;
