import React, { useEffect, useState } from "react";
import "../style.scss";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { useForm, FieldError } from "react-hook-form";
import { fetchTaxOffice, fetchCategory } from "@/src/services/common";

const Basic = ({ setStage, setFormData, formData }: any) => {
  const [taxOffice, setTaxOffice] = useState<any>([]);
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

  useEffect(() => {
    getState();
    getCategory();
  }, []);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      coy_name: formData.coy_name || "",
      category: formData.category || "",
      tax_office: formData.tax_office || "",
      regist_name: formData.regist_name || "",
      phone_no: formData.phone_no || "",
      e_mail: formData.e_mail || "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);

    setFormData((prev: any) => {
      return {
        ...prev,
        ...data,
      };
    });

    setStage(1);
  };

  return (
    <div>
      <form className="identity-form" onSubmit={handleSubmit(onSubmit)}>
        
        <FormTextInput
          label="Business Name"
          name="coy_name"
          placeholder="Enter Business Name"
          register={register}
          error={errors.coy_name as FieldError}
          validation={{ required: true }}
        />
        <SelectInput
          label="Business Category"
          name="category"
          id="category"
          register={register}
          error={!!errors.category}
          validation={{ required: true }}
          options={category}
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
         <FormTextInput
          label="Business Owner's Name"
          name="regist_name"
          placeholder="Enter Business Name"
          register={register}
          error={errors.regist_name as FieldError}
          validation={{ required: true }}
        />
         <FormTextInput
          type="number"
          label="Business Owner's Number"
          name="phone_no"
          placeholder="Enter Business Number"
          register={register}
          error={errors.phone_no as FieldError}
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
          type="email"
          label="Business Owner's Email"
          name="e_mail"
          placeholder="Enter Business Email"
          register={register}
          error={errors.e_mail as FieldError}
          validation={{ required: true }}
        />
        
        <Button text={"Proceed"} />
      </form>
    </div>
  );
};

export default Basic;
