import React, { useEffect, useState } from "react";
import "../style.scss";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { FieldError, useForm } from "react-hook-form";
import { fetchLGAData, fetchStates } from "@/src/services/common";

const Address = ({ setStage, setFormData, formData }: any) => {
  const [state, setState] = useState<any>([]);
  const [lga, setLga] = useState<any>([]);

  const getStates = async () => {
    try {
      const { data } = await fetchStates();
      setState(
        data?.map((item: any) => {
          return {
            label: item.state,
            value: item.idstates,
          };
        })
      );
    } catch (error: any) {
      console.log(error);
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
    getStates();
    getLgas();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      state: formData.state || "",
      lga: formData.lga || "",
      city: formData.city || "",
      ward: formData.ward || "",
      street: formData.street || "",
      house_no: formData.house_no || "",
    },
  });

  const onSubmit = async (data: any) => {
    setFormData({ ...formData, ...data });
    setStage(3);
  };

  return (
    <div>
      <form className="identity-form" onSubmit={handleSubmit(onSubmit)}>
        <SelectInput
          label="State of Origin"
          name="state"
          id="state"
          register={register}
          error={!!errors.state}
          validation={{ required: true }}
          options={state}
        />

        <SelectInput
          label="Business LGA"
          name="lga"
          id="lga"
          register={register}
          error={!!errors.lga}
          validation={{ required: true }}
          options={lga}
        />
        <FormTextInput
          label="City"
          name="city"
          placeholder="Enter City"
          register={register}
          error={errors.city as FieldError}
          validation={{ required: true }}
        />
        <FormTextInput
          label="Ward"
          name="ward"
          placeholder="Enter Ward"
          register={register}
          error={errors.ward as FieldError}
          validation={{ required: true }}
        />
        <FormTextInput
          label="Street"
          name="street"
          placeholder="Enter Street"
          register={register}
          error={errors.street as FieldError}
          validation={{ required: true }}
        />
        <FormTextInput
          type="number"
          label="House Number"
          name="house_no"
          placeholder="Enter House Number"
          register={register}
          error={errors.house_no as FieldError}
          validation={{ required: true }}
        />

        <div className="button-container">
          <button className="button secondary" onClick={() => setStage(1)}>
            Go Back
          </button>
          <Button text={"Proceed"} />
        </div>
      </form>
    </div>
  );
};

export default Address;
