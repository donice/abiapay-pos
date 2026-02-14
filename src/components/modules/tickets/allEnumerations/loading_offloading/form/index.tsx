"use client";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import React, { useEffect, useState } from "react";
import "../style.scss";
import { useForm } from "react-hook-form";
import { useDebounce } from "@/src/hooks/useDebounce";
import { fetchPlateNumberInfo } from "@/src/services/ticketsServices";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { getErrorMessages } from "@/src/utils/helper";
import {
  createLoadingOffLoading,
  fetchLoadingOffloadingVehicleType,
  LoadingOffloadingType,
} from "@/src/services/loadingOffloadingService";
import { getCurrentYear } from "@/src/utils/getCurrentYear";

interface EmblemProduct {
  id: number;
  merchant_id: string;
  business_type: string;
  productCode: string;
  productTag: string;
  planCode: string;
  productName: string;
  category: string;
  amount: string;
  dailyAmount: string;
  weeklyAmount: string;
  monthlyAmount: string;
  emblem: string;
  presumptivetax: string;
  penalty: string;
  penalty_daily: string;
  status: string;
}

const LoadingOffLoadingForm = ({ setShow }: { setShow: any }) => {
  const [embleProductCode, setEmbleProductCode] = useState<EmblemProduct[]>([]);

  const getEmblemProductCode = async () => {
    try {
      const data = await fetchLoadingOffloadingVehicleType();
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
      penalty_status: "valid",
      total_number: "1",
      vehicle_content: "",
      product_code: "",
      category: "",
      tax_payer_phone: "",
      tax_payer_name: "",
      plate_number: "",
      collection_point: "",
      payment_period: getCurrentYear(),
      wallet_type: "fidelity",
      next_payment_date: "1Day",
      amount: "",
    },
  });

  const plateNumber = watch("plate_number");
  const debouncedPlateNumber = useDebounce(plateNumber, 500);

  useEffect(() => {
    if (debouncedPlateNumber) {
      const getPlateNumberInfo = async (plateNumber: string) => {
        try {
          const response = await fetchPlateNumberInfo(plateNumber);
          if (response.data.length !== 0) {
            toast.success(response.message);
            setValue("tax_payer_name", response.data.Name);
            setValue("tax_payer_phone", response.data.Phone);
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
    mutationFn: (data: LoadingOffloadingType) => {
      return createLoadingOffLoading(data);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.data.response_code) {
        data?.data?.response_code == "00"
          ? toast.success(data?.data?.response_message) &&
            setShow({
              mode: true,
              message: data?.message,
              expiry_date: "",
              payment_ref: data?.data?.payment_ref,
            })
          : toast.error(data?.response_message);
      } else {
        toast.error(getErrorMessages(data?.message));
      }
    },
    onError: (error) => {
      toast.error("Unable to create loading offloading request");
      console.log(error);
    },
  });

  const onSubmit = (reqData: any) => {
    mutate(reqData);
    // console.log(reqData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="loading_form">
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

      <SelectInput
        label="Ticket Category"
        name="category"
        id="category"
        register={register}
        error={!!errors.category}
        validation={{ required: true }}
        options={[
          {
            label: "Loading",
            value: "loading",
          },
          {
            label: "Offloading",
            value: "offloading",
          },
        ]}
      />

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
        name={"plate_number"}
        placeholder="Enter Vehicle Plate Number"
        register={register}
        validation={{ required: true }}
        error={errors.plate_number}
      />
      <FormTextInput
        label={"Taxpayer Phone Number"}
        name={"tax_payer_phone"}
        placeholder="Enter Taxpayer Phone Number"
        register={register}
        validation={{ required: true }}
        error={errors.tax_payer_phone}
      />
      <FormTextInput
        label={"Taxpayer Name"}
        name={"tax_payer_name"}
        placeholder="Enter Taxpayer Name"
        register={register}
        validation={{ required: true }}
        error={errors.tax_payer_name}
      />
      <FormTextInput
        label={"Collection Point"}
        name={"collection_point"}
        placeholder="Enter Collection Point"
        register={register}
        validation={{ required: true }}
        error={errors.collection_point}
      />
      {/* <FormTextInput
        label={"Amount"}
        name={"amount"}
        placeholder="Enter Amount"
        register={register}
        validation={{ required: true }}
        error={errors.amount}
        disabled
      /> */}

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

      <div>Amount: ₦ {watch("amount")}</div>

      <Button text={"Process Now"} loading={isPending} />
    </form>
  );
};

export default LoadingOffLoadingForm;
