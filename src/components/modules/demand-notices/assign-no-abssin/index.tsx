"use client"

import { Button, GoBackButton } from '@/src/components/common/button'
import Empty from '@/src/components/common/empty'
import { CustomHeader } from '@/src/components/common/header'
import { FormTextInput, SelectInput } from '@/src/components/common/input'
import { fetchLGAData } from '@/src/services/common'
import { assignDemandNotice, assignDemandNoticePayload, assignnoAbssinDemandNotice, fetchDemandNotice } from '@/src/services/demandNotice'
import { useMutation, useQuery } from 'react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import "./style.scss";

const AssignNoAbssin = () => {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [noticeDetails, setNoticeDetails] = React.useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      notice_number: "",
      abssin: "",
      taxpayer: "",
      phone: "",
      city: "",
      lga: "",
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
    },
  });

  const { data: lgaData } = useQuery({
    queryKey: ["lgaData"],
    queryFn: () => fetchLGAData(),
  });

  // Mutation for searching Demand Notice
  const searchMutation = useMutation({
    mutationFn: async (data: { notice_number: string; merchant_key: string }) =>
      fetchDemandNotice(data),
    onSuccess: (data: any) => {
      const res = data?.data;
      if (res && Object.keys(res).length > 0) {
        setNoticeDetails(res.response_data.notice);
        setErrorMessage(null);
        toast.success(res.response_message || "Demand notice found!");
      } else {
        setNoticeDetails(null);
        setErrorMessage(data.data?.response_message || "No record found");
        toast.error(data.data?.response_message || "No record found");
      }
    },
    onError: (error: any) => {
      setNoticeDetails(null);
      setErrorMessage(error?.error || "An error occurred while searching.");
      toast.error(error?.error || "An error occurred while searching.");
    },
  });

  // Mutation for assigning Demand Notice (with extra taxpayer info)
  const assignMutation = useMutation({
    mutationFn: async (data: any) => assignnoAbssinDemandNotice(data),
    onSuccess: (data: any) => {
      toast.success(data.data?.response_message || "Notice assigned successfully!");
      reset();
      setNoticeDetails(null);
    },
    onError: (error: any) => {
      toast.error(error?.error || "An error occurred. Please try again.");
    },
  });

  // Step 1: handle search
  const handleSearch = (formData: any) => {
    searchMutation.mutate({
      notice_number: formData.notice_number,
      merchant_key: formData.merchant_key,
    });
  };

  // Step 2: handle final assign
  const handleAssign = (formData: any) => {
    assignMutation.mutate(formData);
  };

  return (
    <section className="verify-tickets">
      <div className="verify-tickets-comp">
        <GoBackButton />
        <header className="verify-tickets-comp_header mb-5">
          <CustomHeader title="Assign Notice (No ABSSIN)" desc="" />
        </header>

        {/* Step 1: Search Demand Notice */}
        {!noticeDetails && (
          <form onSubmit={handleSubmit(handleSearch)} className="verify-tickets-comp_form flex flex-col gap-4">
            <FormTextInput
              label="Notice Number"
              type="text"
              name="notice_number"
              register={register}
              validation={{ required: true }}
            //   error={errors.notice_number}
            />
            <Button text="Search Demand Notice" loading={searchMutation.isPending} />
          </form>
        )}

        {/* Step 2: Show details + taxpayer inputs */}
        {noticeDetails && (
          <form onSubmit={handleSubmit(handleAssign)} className="verify-tickets-comp_form flex flex-col gap-4">
            {/* Demand Notice details */}
            <div className="main-table">
              {noticeDetails ? (
                <div className="main-table_form_tickets_container">
                  <div className="tickets">
                    <div className="ticket">
                      <div>
                        <p>{noticeDetails.notice_number}</p>
                        <p>{noticeDetails.payment_status}</p>
                        <p>{noticeDetails.total_amount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Empty text="No Notice Number Found" />
              )}
            </div>

           
            {/* Extra fields for taxpayer */}
            <FormTextInput
              label="Company Name"
              type="text"
              name="company_name"
              placeholder="Enter Company name"
              register={register}
              validation={{ required: true }}
            //   error={errors.taxpayer}
            />
            <FormTextInput
              label="Company Phone Number"
              type="text"
              name="company_phone_number"
              placeholder="Enter Company Phone Number"
              register={register}
              validation={{ required: false }}
            //   error={errors.abssin}
            />
            <FormTextInput
              label="Company Address Street"
              type="text"
              name="company_address_street"
              placeholder="Enter Company Street Address"
              register={register}
              validation={{ required: true }}
            //   error={errors.phone}
            />
             <FormTextInput
              label="Comapy House Number"
              type="text"
              name="company_house_no"
              placeholder="Enter Company House Number"
              register={register}
              validation={{ required: true }}
            //   error={errors.phone}
            />
            <SelectInput
                      label="LGA"
                      placeholder="LGA"
                      name={"lga"}
                      register={register}
                      validation={{ required: true }}
                      error={!!errors.lga_zone}
                      id={"lga"}
                      options={
                        lgaData
                          ? lgaData?.data.map((lga: any) => ({
                              label: lga.lgaName,
                              value: lga.lgaID,
                            }))
                          : []
                      }
                    />

            <Button text="Assign Notice with Taxpayer Details" loading={assignMutation.isPending} />
          </form>
        )}
      </div>
    </section>
  )
}

export default AssignNoAbssin
