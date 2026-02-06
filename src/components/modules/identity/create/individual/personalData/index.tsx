import React, { useEffect } from "react";
import "../style.scss";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { useForm, FieldError } from "react-hook-form";
import FaceCam from "../faceCam";

const PersonalData = ({ setStage, setFormData, formData }: any) => {
  console.log(formData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      first_name: formData.first_name || "",
      middle_name: formData.middle_name || "",
      surname: formData.surname || "",
      indv_title: formData.indv_title || "",
      gender: formData.gender || "",
      marital_status: formData.marital_status || "",
    },
  });

  useEffect(() => {
    setValue("first_name", formData.first_name);
    setValue("middle_name", formData.middle_name);
    setValue("surname", formData.surname);
    setValue("indv_title", formData.indv_title);
    setValue("gender", formData.gender);
    setValue("marital_status", formData.marital_status);
  }, [formData]);

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
        <FaceCam setFormData={setFormData}/>
        <SelectInput
          label="Title"
          name="indv_title"
          id="indv_title"
          register={register}
          error={!!errors.indv_title}
          validation={{ required: true }}
          options={[
            { value: "Mr", label: "Mr" },
            { value: "Mrs", label: "Mrs" },
            { value: "Miss", label: "Miss" },
            { value: "Dr", label: "Dr" },
            { value: "Chief", label: "Chief" },
          ]}
        />
        <FormTextInput
          label="First Name"
          name="first_name"
          placeholder="Enter first name"
          register={register}
          error={errors.first_name as FieldError}
          validation={{ required: true }}
        />
        <FormTextInput
          label="Middle Name"
          name="middle_name"
          placeholder="Enter first name"
          register={register}
          error={errors.middle_name as FieldError}
          validation={{ required: true }}
        />
        <FormTextInput
          label="Last Name"
          name="surname"
          placeholder="Enter first name"
          register={register}
          error={errors.surname as FieldError}
          validation={{ required: true }}
        />
        <SelectInput
          label="Gender"
          name="gender"
          id="gender"
          register={register}
          error={!!errors.gender}
          validation={{ required: true }}
          options={[
            { value: "Female", label: "Female" },
            { value: "Male", label: "Male" },
          ]}
        />
        <SelectInput
          label="Marital Status"
          name="marital_status"
          id="marital_status"
          register={register}
          error={!!errors.marital_status}
          validation={{ required: true }}
          options={[
            { value: "Single", label: "Single" },
            { value: "Married", label: "Married" },
            { value: "Divorced", label: "Divorced" },
            { value: "Widowed", label: "Widowed" },
          ]}
        />
        <Button text={"Proceed"} />
      </form>
    </div>
  );
};

export default PersonalData;
