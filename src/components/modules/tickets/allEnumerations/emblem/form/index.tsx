"use client";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import React, { useEffect, useState } from "react";
import "../style.scss";
import { useForm } from "react-hook-form";
import {
  createTransportEmblem,
  CreateTransportEmblemType,
  fetchEmblemProductCode,
} from "@/src/services/emblemService";
import { useDebounce } from "@/src/hooks/useDebounce";
import { fetchPlateNumberInfo } from "@/src/services/ticketsServices";
import toast from "react-hot-toast";
import { fetchLGAData } from "@/src/services/common";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessages } from "@/src/utils/helper";

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

interface LGA {
  label: string;
  value: string;
}

const CreateEmblemForm = ({ setShow }: { setShow: any }) => {
  const [embleProductCode, setEmbleProductCode] = useState<EmblemProduct[]>([]);
  const [lga, setLga] = useState<LGA[]>([]);

  const getEmblemProductCode = async () => {
    try {
      const { data } = await fetchEmblemProductCode();
      setEmbleProductCode(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLgas = async () => {
    try {
      const { data } = await fetchLGAData();
      setLga(
        data?.map((item: any) => {
          return {
            label: item.lgaName,
            value: item.lgaID,
          };
        })
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmblemProductCode();
    getLgas();
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
      product_code: "",
      plate_number: "",
      taxpayer_phone: "",
      customer_name: "",
      customer_email: "",
      description: "Emblem",
      amount: "",
      lga: "",
      payment_period: "",
      wallet_type: "fidelity",
      payment_method: "fidelity",
    },
  });

  const plateNumber = watch("plate_number");
  const debouncedPlateNumber = useDebounce(plateNumber, 500);

  useEffect(() => {
    if (debouncedPlateNumber) {
      const getPlateNumberInfo = async (plateNumber: string) => {
        try {
          const response = await fetchPlateNumberInfo(plateNumber);

          if (response.data?.length !== 0) {
            toast.success(response.message);
            setValue("customer_name", response.data.Name);
            setValue("taxpayer_phone", response.data.Phone);
            setValue("customer_email", response.data.Email);
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

    console.log(selectedProduct);
    if (selectedProduct) {
      setValue("amount", selectedProduct.emblem);
    }
    setValue("product_code", selectedProductCode);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateTransportEmblemType) => {
      return createTransportEmblem(data);
    },
    onSuccess: (data) => {
      if (data?.response_code) {
        data?.response_code == "00"
          ? toast.success(data?.response_message) &&
            setShow({
              mode: true,
              message: data?.response_message,
              expiry_date: data?.next_expiration_date,
              payment_ref: data?.payment_ref,
            })
          : toast.error(data?.response_message);
      } else {
        toast.error(getErrorMessages(data?.message));
      }
      // console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (reqData: any) => {
    mutate(reqData);
    console.log(reqData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="emblem_form">
      <SelectInput
        label={"Emblem Type"}
        name={"product_code"}
        id={"product_code"}
        validation={{ required: true }}
        options={embleProductCode.map((item: EmblemProduct) => ({
          label: item.productName,
          value: item.productCode,
        }))}
        onChange={handleEmblemTypeChange}
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
        name={"taxpayer_phone"}
        placeholder="Enter Taxpayer Phone Number"
        register={register}
        validation={{ required: true }}
        error={errors.taxpayer_phone}
      />
      <FormTextInput
        label={"Taxpayer Name"}
        name={"customer_name"}
        placeholder="Enter Taxpayer Name"
        register={register}
        validation={{ required: true }}
        error={errors.customer_name}
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
        label={"Payment Period"}
        name={"payment_period"}
        id={"payment_period"}
        register={register}
        validation={{ required: true }}
        error={!!errors.payment_period}
        options={[
          { label: "2025", value: "2025" },
        ]}
      />
      <SelectInput
        label={"LGA"}
        name={"lga"}
        id={"lga"}
        register={register}
        validation={{ required: true }}
        error={!!errors.lga}
        options={lga}
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
  );
};

export default CreateEmblemForm;
