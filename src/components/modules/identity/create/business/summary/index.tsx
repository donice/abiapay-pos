import { Button } from "@/src/components/common/button";
import {
  createBusinessAbssinPayloadType,
  createBusinessAbssin,
} from "@/src/services/identityService";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Summary = ({ setStage, formData }: any) => {
  const mutation = useMutation({
    mutationFn: async (data: createBusinessAbssinPayloadType) =>
      createBusinessAbssin(data),
    onSuccess: (data: any) => {
      toast.success("Successfully created");
      console.log(data);
    },
    onError: (error: any) => {
      toast.error("Something went wrong");
      console.log("ERROR DATA", error, Object.keys(error));
      return error;
    },
  });

  const onSubmit = async (data: any) => {
    mutation.mutate({ ...formData, ...data });
  };

  const { handleSubmit } = useForm({});

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="button-container">
        <button className="button secondary" onClick={() => setStage(2)}>
          Go Back
        </button>
        <Button text={"Proceed"} />
      </form>
    </div>
  );
};

export default Summary;
