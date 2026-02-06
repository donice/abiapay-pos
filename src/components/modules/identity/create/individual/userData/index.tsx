import React, { useEffect, useState } from "react";
import "../style.scss";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { FieldError, useForm } from "react-hook-form";
import {
  fetchCategory,
  fetchSector,
  fetchTaxOffice,
} from "@/src/services/common";
import { submitDate, transformDate } from "@/src/utils/formatDate";
import { useSearchParams } from "next/navigation";

const UserData = ({ setStage, setFormData, formData }: any) => {    
  const querySearch = useSearchParams();
  const source = querySearch.get("source");
  
  // NO_ID_DATA

  const [taxOffice, setTaxOffice] = useState<any>([]);
  const [sector, setSector] = useState<any>([]);
  const [category, setCategory] = useState<any>([]);

  const getState = async () => {
    try {
      const { data } = await fetchTaxOffice();
      setTaxOffice(
        data?.map((item: any) => {
          return {
            label: item.name,
            value: item.name,
          };
        })
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const getCategory = async () => {
    try {
      const { data } = await fetchCategory();
      // console.log("CATEGORY", data);
      setCategory(
        data?.map((item: any) => {
          return {
            label: item.category_name,
            value: item.category_name,
          };
        })
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const getSector = async () => {
    try {
      const { data } = await fetchSector();
      // console.log("SECTOR", data);
      setSector(
        data?.map((item: any) => {
          return {
            label: item.sector_name,
            value: item.sector_name,
          };
        })
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      birth_date: formData.birth_date || "",
      nin: formData.nin || "",
      bvn: formData.bvn || "",
      phone_number: formData.phone_number || "",
      mobile_number: formData.mobile_number || "",
      tax_office: formData.tax_office || "",
      category: formData.category || "",
      sector: formData.sector || "",
      email: formData.email || "",
    },
  });

  console.log(formData.birth_date);

  useEffect(() => {
    //! Please dont touch this
    setValue("birth_date", transformDate(formData.birth_date));
    getState();
    getCategory();
    getSector();
  }, []);

  console.log(watch("birth_date"));

  const onSubmit = (data: any) => {
    console.log("DATA", data);
    setFormData((prev: any) => {
      return {
        ...prev,
        ...data,
        birth_date: submitDate(watch("birth_date")),
      };
    });

    setStage(2);
  };

  // console.log(formData.birth_date);

  return (
    <div>
      <form className="identity-form" onSubmit={handleSubmit(onSubmit)}>
        <FormTextInput
          label="Date of Birth"
          name="birth_date"
          type="date"
          placeholder="Enter Date of Birth"
          register={register}
          error={errors.birth_date as FieldError}
          validation={{ required: true }}
        />
        {source !== "No ID" && <>
          <FormTextInput
            type="number"
            label="NIN"
            name="nin"
            placeholder="Enter NIN"
            register={register}
          />
          <FormTextInput
            type="number"
            label="BVN"
            name="bvn"
            placeholder="Enter BVN"
            register={register}
            validation={{
              minLength: {
                value: 11,
                message: "Length must be above 11 characters",
              },
              maxLength: {
                value: 13,
                message: "Length must be below 13 characters",
              },
            }}
          />
        </>}
        <FormTextInput
          type="number"
          label="Phone Number"
          name="phone_number"
          placeholder="Enter Phone Number"
          value={formData.phone_number}
          register={register}
          error={errors.phone_number as FieldError}
          validation={{
            required: true,
            minLength: {
              value: 11,
              message: "Length must be above 11 characters",
            },
            maxLength: {
              value: 11,
              message: "Length must be below 13 characters",
            },
          }}
        />
        <FormTextInput
          type="number"
          label="Mobile Number"
          name="mobile_number"
          placeholder="Enter Mobile Number"
          register={register}
          error={errors.mobile_number as FieldError}
          validation={{
            required: true,
            minLength: {
              value: 11,
              message: "Length must be above 11 characters",
            },
            maxLength: {
              value: 11,
              message: "Length must be below 11 characters",
            },
          }}
        />
        <FormTextInput
          label="Email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          register={register}
          error={errors.email as FieldError}
          validation={{ required: true }}
        />
        <SelectInput
          label="Tax Office"
          name="tax_office"
          id="tax_office"
          register={register}
          error={!!errors.tax_office}
          validation={{ required: true }}
          options={taxOffice}
        />
        <SelectInput
          label="Category"
          name="category"
          id="category"
          register={register}
          error={!!errors.category}
          validation={{ required: true }}
          options={category}
        />
        <SelectInput
          label="Occupation Sector"
          name="sector"
          id="sector"
          register={register}
          error={!!errors.sector}
          validation={{ required: true }}
          options={sector}
        />
        <div className="button-container">
          <button className="button secondary" onClick={() => setStage(0)}>
            Go Back
          </button>
          <Button text={"Proceed"} />
        </div>
      </form>
    </div>
  );
};

export default UserData;
