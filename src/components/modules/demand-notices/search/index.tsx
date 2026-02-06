"use client";

import { Button, GoBackButton } from "@/src/components/common/button";
import Empty from "@/src/components/common/empty";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import {
  searchDemandNotice,
  searchDemandNoticePayload,
} from "@/src/services/demandNotice";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./style.scss";
import { CustomHeader } from "@/src/components/common/header";

const SearchDemandnoticeComponent = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<searchDemandNoticePayload>({
    defaultValues: {
      notice_number: "",
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
    },
  });

  const [displayDetails, setDisplayDetails] = React.useState<any | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: searchDemandNoticePayload) =>
      searchDemandNotice(data),
    onSuccess: (data: any) => {
      const res = data?.data.response_data.notice;
      console.log("Response Data:", res); // Debugging log

      if (res && Object.keys(res).length > 0) {
        setDisplayDetails(res);
        setErrorMessage(null);
        toast.success("Demand Notice Found");
      } else {
        setDisplayDetails(null);
        setErrorMessage("No matching notice found.");
        toast.error("No matching notice found.");
      }

      reset();
    },
    onError: (error: any) => {
      setDisplayDetails(null);
      setErrorMessage(error?.error || "An error occurred. Please try again.");
      toast.error(error?.error || "An error occurred. Please try again.");
    },
  });

  const onSubmit = (data: searchDemandNoticePayload) => {
    setDisplayDetails(null);
    setErrorMessage(null);
    mutation.mutate({ ...data });
  };

  return (
    <section className="verify-tickets">
      <div className="verify-tickets-comp">
        <GoBackButton />
        <header className="verify-tickets-comp_header">
          <CustomHeader title="Search Notice Ticket" desc="" />
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="verify-tickets-comp_form flex flex-col gap-4"
        >
          <FormTextInput
            label="Notice Number"
            type="text"
            name="notice_number"
            register={register}
            validation={{ required: true }}
            error={errors.notice_number}
          />
          {/* <SelectInput 
            label="Fiscal Year"
            name="year"
            id="year"
            register={register}
            options={[
              { label: "2024", value: "2024" },
              { label: "2025", value: "2025" },
            ]}
            placeholder="Select Fiscal Year"
          /> */}
          <Button text="Search Demand Notice" loading={mutation.isPending} />
        </form>
      </div>

      <div className="verify-tickets-comp_details">
        {errorMessage ? (
          <Empty text={errorMessage} />
        ) : displayDetails ? (
          <div className="border-2 border-dashed rounded-xl px-4">
            <div className="line-items">
              <p>Status:</p>
              <p className="success">Valid Notice</p>
            </div>

            {[
              { label: "Taxpayer Name", key: "taxpayer_name" },
              { label: "Category Name", key: "category_name" },
              { label: "Notice Number", key: "notice_number" },
              { label: "Fiscal Year", key: "fiscal_year" },
              { label: "LGA", key: "lga" },
              { label: "Total Amount", key: "total_amount" },
              { label: "Payment Status", key: "payment_status" },
            ]
              .filter(
                ({ key }, index, self) =>
                  index === self.findIndex((k) => k.key === key) // to remove duplicates
              )
              .map(({ label, key }) => {
                if (!displayDetails?.[key]) return null;

                let value = displayDetails[key];

                if (key === "total_amount") {
                  value = `₦${parseFloat(value).toLocaleString("en-NG", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`;
                }

                return (
                  <div key={key} className="line-items">
                    <p>{label}:</p>
                    <p>{value}</p>
                  </div>
                );
              })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default SearchDemandnoticeComponent;
