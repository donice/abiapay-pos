"use client";
import React, { useEffect } from "react";
import { FormButton } from "@/src/components/common/button";
import { SelectInput, FormTextInput } from "@/src/components/common/input";
import { fetchLGAData } from "@/src/services/common";
import "./style.scss";
import { useForm } from "react-hook-form";
import { fetchMarketEnumerationDetails } from "@/src/services/ticketsServices";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CreateMarketLevyForm from "./createMarketLevy";

const AddMarketTicketForm = () => {
  const router = useRouter();
  const {
    register: registerRenderForm,
    watch: watchRenderForm,
    handleSubmit: handleRenderFormSubmit,
  } = useForm({
    defaultValues: {
      option: "",
      enumeration_id: "",
    },
  });

  const {
    mutate: mutateEnumerationDetails,
    isPending: isPendingEnumerationDetails,
  } = useMutation({
    mutationKey: ["fetchMarketEnumerationDetails"],
    mutationFn: () => {
      return fetchMarketEnumerationDetails({
        enumeration_id: watchRenderForm("enumeration_id"),
      });
    },
    onSuccess: (data) => {
      if (data?.response_code == "00") {
        router.push(
          `/tickets/market/add/${data?.response_data.enumeration_id}`
        );
      } else {
        toast.error(
          data?.response_message || "No details for this enumeration id",
          {}
        );
      }
    },
  });

  const onSubmitEnumerationID = (data: any) => {
    mutateEnumerationDetails();
  };

  const watchOption = watchRenderForm("option");

  return (
    <div className="add-market-ticket">
      <>
        {" "}
        <h2 className="mb-1 text-uppercase font-semibold text-teal-600 text-xs tracking-wider">
          DO YOU HAVE A MARKET ENUMERATION ID?
        </h2>
        <SelectInput
          label="Select Option"
          name="option"
          register={registerRenderForm}
          placeholder="Select Option"
          id={""}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        {watchOption == "yes" ? (
          <form onSubmit={handleRenderFormSubmit(onSubmitEnumerationID)}>
            <div className="add-market-ticket">
              <FormTextInput
                label="Enumeration ID"
                type="number"
                name="enumeration_id"
                register={registerRenderForm}
                placeholder="Enter Enumeration ID"
              />{" "}
              <FormButton
                text={"Check Details"}
                disabled={
                  watchRenderForm("enumeration_id") == "" ||
                  isPendingEnumerationDetails
                }
                loading={isPendingEnumerationDetails}
              />
            </div>
          </form>
        ) : (
          watchOption == "no" && <CreateMarketLevyForm />
        )}
      </>
    </div>
  );
};

export default AddMarketTicketForm;
