import React, { useEffect, useState } from "react";
import "../style.scss";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { Button } from "@/src/components/common/button";
import { FieldError, useForm } from "react-hook-form";
import { fetchLGAData, fetchStates } from "@/src/services/common";
import {
  createIndividualAbssin,
  createIndividualAbssinPayloadType,
} from "@/src/services/identityService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AbssinSuccessModal, SuccessModal } from "@/src/components/common/modal";

const OriginData = ({ setStage, setFormData, formData }: any) => {
  const [state, setState] = useState<any>([]);
  const [lga, setLga] = useState<any>([]);
  const [show, setShow] = useState({
    mode: false,
    message: "",
  });

  const getStates = async () => {
    try {
      const { data } = await fetchStates();
      setState(
        data?.map((item: any) => {
          return {
            label: item.state,
            value: item.state,
            // value: item.idstates,
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
      nationality: "Nigerian",
      state_of_origin: formData.state_of_origin || "",
      lga: formData.lga || "",
      state_of_residence: formData.state_of_residence || "",
      address: formData.address || "",
      ward: formData.ward || "",
      sector: formData.sector || "",
      city: formData.city || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: createIndividualAbssinPayloadType) =>
      createIndividualAbssin(data),
    onSuccess: (data: any) => {
      console.log(data);
      toast.success("Successfully created");
      setShow({ mode: true, message: data?.message });
    },
    onError: (error: any) => {
      console.log("ERROR DATA", error, Object.keys(error));
      return error;
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    setFormData((prev: any) => {
      return {
        ...prev,
        ...data,
      };
    });

    console.log(formData);

    mutation.mutate({ ...formData, ...data });
  };

  return (
    <div>
      <form className="identity-form" onSubmit={handleSubmit(onSubmit)}>
        <FormTextInput
          label="Nationality"
          name="nationality"
          type="text"
          placeholder="Enter Nationality"
          value={"Nigerian"}
          register={register}
          error={errors.nationality}
          validation={{ required: true }}
        />
        <SelectInput
          label="State of Origin"
          name="state_of_origin"
          id="state_of_origin"
          register={register}
          error={!!errors.state_of_origin}
          validation={{ required: true }}
          options={state}
        />
        <SelectInput
          label="L.G.A of Origin"
          name="lga"
          id="lga"
          placeholder="Enter L.G.A"
          register={register}
          options={lga}
          error={!! errors.lga}
          validation={{ required: true }}
        />
        <div>
          <span className="go_back">Residence Information</span>
        </div>

        <SelectInput
          label="State of Residence"
          name="state_of_residence"
          id="state_of_residence"
          register={register}
          error={!!errors.state_of_residence}
          validation={{ required: true }}
          options={state}
        />
        <FormTextInput
          label="L.G.A of Residence"
          name="city"
          placeholder="Enter L.G.A"
          register={register}
          error={errors.city as FieldError}
          validation={{ required: true }}
        />

        <FormTextInput
          label="Address"
          name="address"
          placeholder="Enter Address"
          register={register}
          error={errors.address as FieldError}
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

        <div className="button-container">
          <button className="button secondary" onClick={() => setStage(1)}>
            Go Back
          </button>
          <Button text={"Create ABSSIN"} loading={mutation.isPending} disabled={mutation.isPending}  />
        </div>
      </form>

      {
        show.mode && (
          <AbssinSuccessModal link={"/identity/create/individual"}  />
        )
      }
    </div>
  );
};

export default OriginData;
