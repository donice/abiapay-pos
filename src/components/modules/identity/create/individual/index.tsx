"use client";
import React, { useEffect, useState } from "react";
import ProgressBar from "./progressBar";
import "./style.scss";
import PersonalData from "./personalData";
import {
  createIndividualAbssinPayloadType,
  getBVNInfo,
  getNINInfo,
} from "@/src/services/identityService";
import UserData from "./userData";
import OriginData from "./originData";
import { useSearchParams } from "next/navigation";
import { useMutation } from "react-query";
import { isBrowser } from "@/src/utils/isBrowser";

const CreateIndividualAbssinComponent = () => {
  const noIdDetails =
  isBrowser && window.sessionStorage.getItem("NO_ID_DATA")
    ? window.sessionStorage.getItem("NO_ID_DATA")
    : null;
    const details = noIdDetails && JSON.parse(noIdDetails);
  const querySearch = useSearchParams();
  const source = querySearch.get("source");
  const _id = querySearch.get("_id");

  console.log("NO_ID_DATA", details);

  const [stage, setStage] = useState(0);
  const [formData, setFormData] = useState<createIndividualAbssinPayloadType>({
    indv_title: "",
    first_name: "",
    middle_name: "",
    surname: "",
    birth_date: "",
    email: details && details.email || "",
    gender: "",
    nin: "",
    nationality: "",
    state_of_origin: "",
    state_of_residence: "",
    marital_status: "",
    bvn: "",
    city: "",
    ward: "",
    address: "",
    lga: "",
    phone_number: details && details.value || "",
    sector: "",
    category: "",
    tax_office: "",
    mobile_number: "",
    image: "",
  });


  const { mutate } = useMutation({
    mutationFn:
      source === "bvn"
        ? async (data: any) => {
            return await getBVNInfo(data);
          }
        : source === "nin"
        ? async (data: any) => {
            return await getNINInfo(data);
          }
        : async (data: any) => {
            return console.log(data);
          },
    onSuccess: (data: any) => {
      if (source === "bvn") {
        setFormData((prev: any) => {
          return {
            ...prev,
            indv_title: data?.data?.title,
            first_name: data?.data?.firstname,
            middle_name: data?.data?.middlename,
            surname: data?.data?.lastname,
            birth_date: data?.data?.birthdate,
            email: data?.data?.email,
            gender: data?.data?.gender,
            nin: data?.data?.nin,
            nationality: data?.data?.nationality,
            state_of_origin: data?.data?.state_of_origin,
            state_of_residence: data?.data?.state_of_residence,
            marital_status: data?.data?.marital_status,
            bvn: data?.data?.bvn,
            address: data?.data?.residential_address,
            lga: data?.data?.lga_of_origin,
            phone_number: data?.data?.phone,
            mobile_number: data?.data?.phone2,
            image: data?.data?.photo,
          };
        });
      }
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  useEffect(() => {
    mutate({ id: _id });
  }, []);

  return (
    <section>
      <ProgressBar stage={stage} setStage={setStage} />

      {stage === 0 && (
        <PersonalData
          formData={formData}
          setFormData={setFormData}
          setStage={setStage}
        />
      )}
      {stage === 1 && (
        <UserData
          formData={formData}x
          setFormData={setFormData}
          setStage={setStage}
        />
      )}
      {stage === 2 && (
        <OriginData
          formData={formData}
          setFormData={setFormData}
          setStage={setStage}
        />
      )}
    </section>
  );
};

export default CreateIndividualAbssinComponent;
