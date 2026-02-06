import React, { useEffect, useState } from "react";
import "../style.scss";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { FieldError, useForm } from "react-hook-form";
import { fetchBusinessType, fetchCategory, fetchSector } from "@/src/services/common";

const Business = ({ setStage, setFormData, formData }: any) => {
  const [sector, setSector] = useState<any>([]);
  const [businessType, setBusinessType] = useState<any>([]);
  const [category, setCategory] = useState<any>([]);

  const getOrganisation = async () => {
    try {
      const { data } = await fetchCategory();
      setCategory(
        data?.map((item: any) => {
          return {
            label: item.category_name,
            value: item.id,
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

  const getBusinessType = async () => {
    try {
      const { data } = await fetchBusinessType();
      // console.log("SECTOR", data);
      setBusinessType(
        data?.map((item: any) => {
          return {
            label: item.business_type,
            value: item.business_type,
          };
        })
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrganisation();
    getSector();
    getBusinessType();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type_of_organisation: formData.type_of_organisation || "",
      sector: formData.sector || "",
      line_of_business: formData.line_of_business || "",
      companytin: formData.companytin || "",
      rcno: formData.rcno || "",
      mobile_no: formData.mobile_no || "",
      enterprise_reg_no: formData.enterprise_reg_no || "",
      date_of_incorporation: formData.date_of_incorporation || "",
      date_of_commencement: formData.date_of_commencement || "",
    },
  });

  const onSubmit = (data: any) => {
    setFormData((prev: any) => {
      return {
        ...prev,
        ...data,
      };
    });

    setStage(3);
  };

  return (
    <div>
      <form className="identity-form" onSubmit={handleSubmit(onSubmit)}>
        <SelectInput
          label="Organization Type"
          name="type_of_organisation"
          id="type_of_organisation"
          register={register}
          error={!!errors.type_of_organisation}
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
        <SelectInput
          label="Occupation Sector"
          name="line_of_business"
          id="line_of_business"
          register={register}
          error={!!errors.line_of_business}
          validation={{ required: true }}
          options={businessType}
        />
        <FormTextInput
          label="Company TIN (Tax Identification Number)"
          name="companytin"
          placeholder="Enter Company Tax Identification Number"
          register={register}
          error={errors.companytin as FieldError}
          validation={{ required: true }}
        />
        <FormTextInput
          label="RC Number"
          name="rcno"
          placeholder="Enter RC Number"
          register={register}
          error={errors.rcno as FieldError}
          validation={{ required: true }}
        />
        <FormTextInput
        type="number"
          label="Business Phone Number"
          name="mobile_no"
          placeholder="Enter Business Phone Number"
          register={register}
          error={errors.mobile_no as FieldError}
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
          label="Enterprise Registration Number"
          name="enterprise_reg_no"
          placeholder="Enter Enterprise Registration Number"
          register={register}
          error={errors.enterprise_reg_no as FieldError}
          validation={{ required: true }}
        />
        <FormTextInput
          type="date"
          label="Date of Incorporation"
          name="date_of_incorporation"
          placeholder="Enter Date of Incorporation"
          register={register}
          error={errors.date_of_incorporation as FieldError}
          validation={{ required: true }}
        />
        <FormTextInput
          type="date"
          label="Date of Commencement"
          name="date_of_commencement"
          placeholder="Enter Date of Commencement"
          register={register}
          error={errors.date_of_commencement as FieldError}
          validation={{ required: true }}
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

export default Business;
