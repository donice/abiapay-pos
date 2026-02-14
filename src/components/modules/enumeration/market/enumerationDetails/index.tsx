import React, { useEffect, useState } from "react";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { FieldError, useForm } from "react-hook-form";
import {
  createMarketEnumeration,
  CreateMarketEnumerationType,
  fetchMarkets,
} from "@/src/services/marketEnumerationService";
import { fetchABSSINInfo, fetchLGAData } from "@/src/services/common";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { useDebounce } from "@/src/hooks/useDebounce";
import { getCurrentYear } from "@/src/utils/getCurrentYear";

interface ModalType {
  response_code: string;
  payment_reference: string;
  enumeration_id: string;
}
const EnumerationDetails = ({ setStage, setFormData, formData }: any) => {
  const [markets, setMarkets] = useState([]);
  const [lga, setLga] = useState([]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateMarketEnumerationType) => {
      return createMarketEnumeration(data);
    },
    mutationKey: ["save_owner_contact"],
    onSuccess: (data) => {
      if (data.response_code) {
        toast.success("Shop Enumerated Successfully");
        setFormData({
          payment_reference: data?.payment_reference,
          enumeration_id: data?.enumeration_id,
        });
        setStage(1);
      } else {
        toast.error("Shop Enumeration Failed");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error Saving Driver's data");
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      taxpayer_category: formData?.taxpayer_category || "",
      abssin: formData?.abssin || "",
      shop_owner_name: formData?.shop_owner_name || "",
      shop_owner_phone: formData?.shop_owner_phone || "",
      shop_number: formData?.shop_number || "",
      shop_category: formData?.shop_category || "",
      revenue_year: formData?.revenue_year || getCurrentYear(),
      zone_line: formData?.zone_line || "",
      market: formData?.market || "",
      monthly_income_range: formData?.monthly_income_range || "",
      lga: formData?.lga || "",
      enumeration_fee: formData?.enumeration_fee || "18000",
      ticket_amount_shop_owner: formData?.ticket_amount_shop_owner || "18000",
      ticket_amount_per_occupant:
        formData?.ticket_amount_per_occupant || "18000",
      payment_method: formData?.payment_method || "fidelity",
    },
  });

  const onSubmit = (reqData: any) => {
    mutate({ ...reqData, ...formData });
    // setFormData(enumerationDetails);
  };
  const getMarkets = async () => {
    try {
      const { data } = await fetchMarkets();
      const res = data?.map((item: any) => {
        return {
          label: item.market,
          value: item.market,
        };
      });
      setMarkets(res);
    } catch (error: any) {
      console.log(error);
      toast.error("Error Enumerating Vehicle");
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
    getMarkets();
    getLgas();
  }, []);

  const abssin = watch("abssin");
  const debouncedAbssin = useDebounce(abssin, 300);

  useEffect(() => {
    if (debouncedAbssin) {
      const getPlateNumberInfo = async (req: string) => {
        try {
          const response = await fetchABSSINInfo({ id: req });

          if (response.data?.length !== 0) {
            toast.success(response.message);
            setValue(
              "shop_owner_name",
              response.data.firstname +
                " " +
                response.data.middle_name +
                " " +
                response.data.lastname
            );
            setValue("shop_owner_phone", response.data.phone_number);
          }
        } catch (error) {
          // toast.error("Error fetching plate number information");
          console.log(error);
        }
      };

      getPlateNumberInfo(debouncedAbssin);
    }
  }, [debouncedAbssin, setValue]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="enumeration-form">
        <SelectInput
          label="Taxpayer Category"
          name="taxpayer_category"
          id="taxpayer_category"
          options={[
            { label: "Individual", value: "Individual" },
            { label: "Non-individual", value: "Non-individual" },
          ]}
          placeholder="Select Taxpayer Category"
          register={register}
          validation={{ required: true }}
        />
        <FormTextInput
          label="ABSSIN"
          type="number"
          name="abssin"
          placeholder="Enter ABSSIN"
          register={register}
          validation={{
            required: "ABSSIN is Required",
            minLength: {
              value: 10,
              message: "Length must be above 10 characters",
            },
            maxLength: {
              value: 11,
              message: "Length must be below 11 characters",
            },
          }}
          error={errors.abssin as FieldError}
        />
        <FormTextInput
          label="Shop Owner's Name"
          type="text"
          name="shop_owner_name"
          placeholder="Enter Shop Owner's Name"
          register={register}
          validation={{
            required: true,
          }}
          error={errors.shop_owner_name as FieldError}
        />
        <FormTextInput
          label="Shop Owner's Phone Number"
          type="number"
          name="shop_owner_phone"
          placeholder="Enter Shop Owner's Phone Number"
          register={register}
          validation={{
            required: "Phone Number is Required",
            minLength: {
              value: 11,
              message: "Length must be above 11 characters",
            },
            maxLength: {
              value: 11,
              message: "Length must be below 13 characters",
            },
          }}
          error={errors.shop_owner_phone as FieldError}
        />
        <SelectInput
          label="Shop Category"
          name="shop_category"
          id="shop_category"
          options={[
            { label: "Single", value: "Single" },
            { label: "Double", value: "Double" },
            { label: "Small Warehouse", value: "Small Warehouse" },
            { label: "Medium Warehouse", value: "Medium Warehouse" },
            { label: "Large Warehouse", value: "Large Warehouse" },
          ]}
          placeholder="Select Shop Category"
          register={register}
          validation={{ required: true }}
        />
        <SelectInput
          label="Market"
          name="market"
          id="market"
          options={markets}
          placeholder="Select Market"
          register={register}
          validation={{ required: true }}
        />
        <FormTextInput
          label="Zone/Line"
          type="text"
          name="zone_line"
          placeholder="Enter Zone/Line"
          register={register}
          validation={{
            required: true,
          }}
          error={errors.zone_line as FieldError}
        />
        <FormTextInput
          label="Shop Number"
          type="text"
          name="shop_number"
          placeholder="Enter Shop Number"
          register={register}
          validation={{
            required: true,
          }}
          error={errors.shop_number as FieldError}
        />

        <SelectInput
          label="Monthly Income"
          name="monthly_income_range"
          id="monthly_income_range"
          options={[
            { label: "Less than 10,000", value: "Less than 10,000" },
            { label: "10,000 - 50,000", value: "10,000 - 50,000" },
            { label: "50,001 - 100,000", value: "50,001 - 100,000" },
            { label: "100,001 - 500,000", value: "100,001 - 500,000" },
            { label: "500,001 - 1,000,000", value: "500,001 - 1,000,000" },
            { label: "1,000,001 - 5,000,000", value: "1,000,001 - 5,000,000" },
            {
              label: "5,000,001 - 10,000,000",
              value: "5,000,001 - 10,000,000",
            },
            { label: "Above 10,000,000", value: "Above 10,000,000" },
          ]}
          placeholder="Select Monthly Income"
          register={register}
          validation={{ required: true }}
        />
        {/* <SelectInput
          label="LGA"
          name="lga"
          id="lga"
          options={lga}
          placeholder="Select LGA"
          register={register}
          validation={{ required: true }}
        /> */}

        {/* <FormTextInput
          disabled
          label="Annual Shop Ticket Amount (Shop Owner)"
          type="text"
          name="ticket_amount_shop_owner"
          value={"18000"}
          placeholder="Enter Annual Shop Ticket Amount (Shop Owner)"
          register={register}
          validation={{
            required: true,
          }}
        /> */}
        {/* <SelectInput
          label="Payment Method"
          name="payment_method"
          id="payment_method"
          options={[
            { label: "Fidelity", value: "fidelity" },
            { label: "Access", value: "access" },
          ]}
          placeholder="Select Payment Method"
          register={register}
          validation={{ required: true }}
        /> */}

        <Button text="Create Enumeration" loading={isPending} />
      </form>
    </div>
  );
};

export default EnumerationDetails;
