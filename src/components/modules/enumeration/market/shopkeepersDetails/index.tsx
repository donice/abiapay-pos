"use client";
import { Button } from "@/src/components/common/button";
import React, { useEffect, useState } from "react";
import { FormTextInput } from "@/src/components/common/input";
import "../style.scss";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EnumerationModal } from "@/src/components/common/modal";
import { useDebounce } from "@/src/hooks/useDebounce";
import { fetchABSSINInfo } from "@/src/services/common";

const ShopkeepersDetails = ({ setStage, formData }: any) => {
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shopkeeper_abssin: "",
      shopkeeper_name: "",
      shopkeeper_phone: "",
    },
  });

  const onSubmit = (reqData: any) => {
    console.log(reqData);
    toast.success("Store keepers Added");
    setShow(true);
  };

  const shopkeepersAbssin = watch("shopkeeper_abssin");
  const debouncedShopkeepersAbssin = useDebounce(shopkeepersAbssin, 300);

  useEffect(() => {
    if (debouncedShopkeepersAbssin) {
      const getPlateNumberInfo = async (req: string) => {
        try {
          const response = await fetchABSSINInfo({ id: req });

          if (response.data?.length !== 0) {
            toast.success(response.message);
            setValue(
              "shopkeeper_name",
              response.data.firstname +
                " " +
                response.data.middle_name +
                " " +
                response.data.lastname
            );
            setValue("shopkeeper_phone", response.data.phone_number);
          }
        } catch (error) {
          // toast.error("Error fetching plate number information");
          console.log(error);
        }
      };

      getPlateNumberInfo(debouncedShopkeepersAbssin);
    }
  }, [debouncedShopkeepersAbssin, setValue]);

  return (
    <>
      {formData?.payment_reference && (
        <div className="formdata">
          <p>Paymnet Reference: <span>{formData.payment_reference}</span> </p>
          <p>Enumeration ID: <span>{formData.enumeration_id}</span></p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="enumeration-form">
        <FormTextInput
          label={"Shopkeeper's ABSSIN"}
          placeholder={"Enter Shopkeeper's ABSSIN"}
          name={"shopkeeper_abssin"}
          register={register}
          validation={{ required: true }}
          error={errors.shopkeeper_abssin}
        />
        <FormTextInput
          label={"Shopkeeper's Name"}
          placeholder={"Enter Shopkeeper's Name"}
          name={"shopkeeper_name"}
          register={register}
          validation={{ required: true }}
          error={errors.shopkeeper_name}
        />
        <FormTextInput
          label={"Shopkeeper's Phone"}
          placeholder={"Enter Shopkeeper's Phone"}
          name={"shopkeeper_phone"}
          register={register}
          validation={{ required: true }}
          error={errors.shopkeeper_phone}
        />

        <div className="button-container">
          <button className="button secondary" onClick={() => setStage(0)}>
            Go Back
          </button>
          <Button text="Complete" />
        </div>
      </form>

      {show && (
        <EnumerationModal
          id={``}
          maintext="Shopkeepers Added Successfully"
          link="/dashboard"
          text={"Done"}
        />
      )}
    </>
  );
};

export default ShopkeepersDetails;
