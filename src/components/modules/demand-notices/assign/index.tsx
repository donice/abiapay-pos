"use client";

import { Button, GoBackButton } from "@/src/components/common/button";
import { CustomHeader } from "@/src/components/common/header";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { fetchCategory, fetchLGAData } from "@/src/services/common";
import {
  assignDemandNotice,
  assignnoAbssinDemandNotice,
  fetchDemandNotice,
  searchCompany,
} from "@/src/services/demandNotice";
import { useMutation, useQuery } from "react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./style.scss";
import { InformationModal } from "@/src/components/common/modal";
import { useRouter } from "next/navigation";

const AssignNotice = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [noticeDetails, setNoticeDetails] = React.useState<any | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalProps, setModalProps] = React.useState<any>(null);
  const [noticeNumber, setNoticeNumber] = React.useState<string>("");
  const [taxpayerId, setTaxpayerId] = React.useState<string>("");
  const [mode, setMode] = React.useState<"abssin" | "no_abssin" | "">("");

  const [companySuggestions, setCompanySuggestions] = React.useState<any[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      notice_number: "",
      abssin: "",
      company_name: "",
      company_phone_number: "",
      company_address_street: "",
      company_house_no: "",
      lga: "",
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
    },
  });

  const { data: lgaData } = useQuery({
    queryKey: ["lgaData"],
    queryFn: () => fetchLGAData(),
  });

  const { data: lgaCategory } = useQuery({
    queryKey: ["lgaCategory"],
    queryFn: () => fetchCategory(),
  });

  // Search Company Handler
  const handleCompanySearch = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length < 2) {
      setCompanySuggestions([]);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await searchCompany({ search_term: value }); 
      console.log("Company search result:", res);
      if (res?.response_data) {
        setCompanySuggestions(res.response_data);
      } else {
        setCompanySuggestions([]);
      }
    } catch (err) {
      console.error("Error searching company:", err);
      setCompanySuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Demand Notice Search Mutation
  const searchMutation = useMutation({
    mutationFn: async (data: { notice_number: string; merchant_key: string }) =>
      fetchDemandNotice(data),
    onSuccess: (data: any) => {
      const res = data?.data;
      if (res && Object.keys(res).length > 0) {
        const notice = res.response_data.notice;
        setNoticeNumber(notice.notice_number);
        const normalizedNotice = Array.isArray(notice) ? notice[0] : notice;
        setNoticeDetails(normalizedNotice);
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

  // Assign with ABSSIN
  const assignWithAbssinMutation = useMutation({
    mutationFn: async (data: any) => assignDemandNotice(data),
    onSuccess: (data: any) => handleAssignResponse(data),
    onError: (error: any) => {
      toast.error(error?.error || "An error occurred. Please try again.");
    },
  });

  // Assign without ABSSIN
  const assignWithoutAbssinMutation = useMutation({
    mutationFn: async (data: any) => assignnoAbssinDemandNotice(data),
    onSuccess: (data: any) => handleAssignResponse(data),
    onError: (error: any) => {
      toast.error(error?.error || "An error occurred. Please try again.");
    },
  });

  const handleAssignResponse = (data: any) => {
    const responseCode = data?.data?.response_code;
    console.log("Assign Response Data:", data?.data?.response_message);
    const responseMessage =
      data?.data?.response_message || "";
    const assignedNoticeNumber = data?.data?.response_data?.notice_number || "";

    if (responseCode !== "00") {
      setModalProps({
        mode: "warning",
        maintext: responseMessage,
        subtext: "Please check and try again.",
        link: "/demand-notices",
      });
      setShowModal(true);
      return;
    }

    toast.success(responseMessage);
    reset();
    setNoticeDetails(null);
    setNoticeNumber(assignedNoticeNumber);
    setTaxpayerId(data?.data?.response_data?.taxpayer_id || "");
    setModalProps({
      mode: "success",
      maintext: responseMessage,
      subtext: `Taxpayer Name: ${data?.data?.response_data.taxpayer_name}`,
      success_text: "Assign Another",
      link: "/demand-notices",
    });
    setShowModal(true);
  };

  const handleSearch = (formData: any) => {
    searchMutation.mutate({
      notice_number: formData.notice_number,
      merchant_key: formData.merchant_key,
    });
  };

  const handleAssign = (formData: any) => {

     const geoString = typeof window !== "undefined" 
    ? sessionStorage.getItem("USER_GEOLOCATION") 
    : "";
    const payload = {
    ...formData,
    geolocation: geoString || "", 
  };
    if (mode === "abssin") {
      assignWithAbssinMutation.mutate(payload);
    } else {
      assignWithoutAbssinMutation.mutate(payload);
    }
  };

  return (
    <section className="verify-tickets">
      <div className="verify-tickets-comp">
        <GoBackButton />
        <header className="verify-tickets-comp_header mb-5">
          <CustomHeader title="Assign Demand Notice" desc="" />
        </header>

        {/* Mode Selector */}
        <div className="verify-tickets-comp_form flex flex-col gap-4">
          <SelectInput
            label="Select Option"
            placeholder="Choose..."
            name="mode"
            id="mode"
            value={mode}
            onChange={(e: any) => setMode(e.target.value)}
            options={[
              { label: "Assign with ABSSIN", value: "abssin" },
              { label: "Assign without ABSSIN", value: "no_abssin" },
            ]}
          />
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit(handleSearch)}
          className="verify-tickets-comp_form flex flex-col gap-4 mt-4"
        >
          <FormTextInput
            label="Notice Number"
            type="text"
            name="notice_number"
            register={register}
            validation={{ required: true }}
          />
          <Button
            text="Search Demand Notice"
            loading={searchMutation.isPending}
          />
        </form>

        {/* Notice Details */}
        {noticeDetails && (
          <>
            <div className="main-table">
              <div className="main-table_form_tickets_container">
                <div className="tickets">
                  <div className="ticket">
                    <div>
                      <p>{noticeDetails.notice_number}</p>
                      <p
                        style={{
                          color:
                            noticeDetails.status?.toLowerCase() === "pending"
                              ? "green"
                              : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {noticeDetails.status?.toLowerCase() === "pending"
                          ? "Pending..."
                          : noticeDetails.status}
                      </p>
                      <p>
                        ₦
                        {parseFloat(
                          noticeDetails.total_amount
                        ).toLocaleString()}
                      </p>
                      <p>
                        {lgaData?.data?.find(
                          (lga: any) => lga.lgaID === noticeDetails.lga
                        )?.lgaName ||
                          noticeDetails.lga ||
                          "N/A"}
                      </p>
                      <p>
                        <strong>Business Category: </strong>
                        {lgaCategory?.data?.find(
                          (cat: any) => cat.id === noticeDetails.cdn_category
                        )?.category_name || "N/A"}
                      </p>
                    </div>
                    <div>
                    <p>{" "}</p>
                    <p>{" "}</p>
                    <p>{""}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Inputs */}
            {noticeDetails.status?.toLowerCase() !== "served" && (
              <form
                onSubmit={handleSubmit(handleAssign)}
                className="verify-tickets-comp_form flex flex-col gap-4 mt-6"
              >
                {mode === "abssin" ? (
                  <FormTextInput
                    label="ABSSIN"
                    type="text"
                    name="abssin"
                    placeholder="Enter Corporate ABSSIN"
                    register={register}
                    validation={{ required: true }}
                  />
                ) : (
                  <>
                    {/* Company Name with Suggestions */}
                    <div className="relative">
                      <FormTextInput
                        label="Company Name"
                        type="text"
                        name="company_name"
                        placeholder="Enter Company Name"
                        register={register}
                        validation={{
                          required: true,
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                            handleCompanySearch(e),
                        }}
                      />
                      {searchLoading && (
                        <p className="text-sm text-gray-400">Searching...</p>
                      )}
                      {companySuggestions.length > 0 && (
                        <ul className="absolute bg-white border border-gray-200 rounded-md shadow-md mt-1 w-full z-10 max-h-48 overflow-y-auto">
                          {companySuggestions.map((company, idx) => (
                            <li
                              key={idx}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setValue("company_name", company.company_name);
                                setValue(
                                  "company_phone_number",
                                  company.phone_number
                                );
                                setValue(
                                  "company_address_street",
                                  company.street
                                );
                                setValue(
                                  "company_house_no",
                                  company.company_house_no
                                );
                                setValue("lga", company.lga);
                                setCompanySuggestions([]);
                              }}
                            >
                              {company.company_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <FormTextInput
                      label="Company Phone Number"
                      type="text"
                      name="company_phone_number"
                      placeholder="Enter Company Phone Number"
                      register={register}
                    />
                    <FormTextInput
                      label="Company Address Street"
                      type="text"
                      name="company_address_street"
                      placeholder="Enter Company Street Address"
                      register={register}
                      validation={{ required: true }}
                    />
                    <FormTextInput
                      label="Company House Number"
                      type="text"
                      name="company_house_no"
                      placeholder="Enter Company House Number"
                      register={register}
                      validation={{ required: true }}
                    />
                    <SelectInput
                      label="LGA"
                      placeholder="LGA"
                      name="lga"
                      register={register}
                      validation={{ required: true }}
                      error={!!errors.lga}
                      id="lga"
                      options={
                        lgaData?.data?.map((lga: any) => ({
                          label: lga.lgaName,
                          value: lga.lgaID,
                        })) || []
                      }
                    />
                  </>
                )}

                <Button
                  text={
                    mode === "abssin"
                      ? "Assign Notice with ABSSIN"
                      : "Assign Notice with Taxpayer Details"
                  }
                  loading={
                    mode === "abssin"
                      ? assignWithAbssinMutation.isPending
                      : assignWithoutAbssinMutation.isPending
                  }
                />
              </form>
            )}
          </>
        )}

        {/* Modal */}
        {showModal && modalProps && (
          <InformationModal {...modalProps} close={() => setShowModal(false)} />
        )}
      </div>
    </section>
  );
};

export default AssignNotice;
