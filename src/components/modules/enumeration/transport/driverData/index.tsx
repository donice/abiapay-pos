"use client";
import { Button } from "@/src/components/common/button";
import React, { useEffect, useState } from "react";
import { LuUser } from "react-icons/lu";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import "../style.scss";
import { useForm } from "react-hook-form";
import {
  SaveContactType,
  saveContact,
  CreateTicketType,
  createTransportEnumeration,
} from "@/src/services/transportEnumerationService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { EnumerationSuccessModal } from "@/src/components/common/modal";
import { fetchLGAData } from "@/src/services/common";
import { getCurrentYear } from "@/src/utils/getCurrentYear";

interface TicketsDataType {
  response_code: string;
  response_message: string;
  enumeration_id: string;
  assetCode: string;
}

const DriverData = ({ setStage, details, formData }: any) => {
  const [lga, setLga] = useState([]);

  const [ticketData, setTicketData] = useState<TicketsDataType>({
    response_code: "",
    response_message: "",
    enumeration_id: "",
    assetCode: "",
  });
  const [show, setShow] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SaveContactType) => {
      return saveContact(data);
    },
    mutationKey: ["save_driver_contact"],
    onSuccess: (data) => {
      console.log(data || "Driver's data saved successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error Saving Driver's data");
    },
  });

  const { mutate: mutate2 } = useMutation({
    mutationFn: (data: CreateTicketType) => {
      return createTransportEnumeration(data);
    },
    mutationKey: ["create_transport_enumeration"],
    onSuccess: (data) => {
      console.log(data?.response_message || "Successful Enumeration");
      console.log("TICKETS DATA", data);
      setTicketData(data);
      setShow(true);
      toast.success(
        data?.response_message || "Vehicle Enumerated Successfully"
      );
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error Enumerating Vehicle");
    },
  });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      name: details?.driver.driverName || "",
      phone: details?.vehicle_owner.phoneNumber || "",
      plate_number: formData.plate_number || "",
      contact_type: "driver",
      taxpayer_location: formData.taxpayer_location || "",
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
    },
  });

  const req: CreateTicketType = {
    taxpayer_category: "individual",
    abssin: details?.vehicle_owner.abssin || "",
    vehicle_plate_number: formData.plate_number.toUpperCase() || "",
    taxpayer_name: details?.vehicle_owner.ownerName || "",
    taxpayer_phone: formData.phone_number || "",
    revenue_year: getCurrentYear().toString(),
    taxpayer_location: formData.taxpayer_location || "",
    operating_park: formData.operating_park || "",
    trade_union: formData.trade_union || "",
    vehicle_category: formData.vehicle_category || "",
    owner_name: details?.vehicle_owner.ownerName || "",
    owner_address: details?.vehicle_owner.ownerAddress || "",
    daily_ticket_amount: 250,
    enumeration_fee: "1500",
    merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
  };

  const onSubmit = (reqData: any) => {
    try {
      mutate(reqData);
      mutate2({ ...req, taxpayer_location: reqData.taxpayer_location });
    } catch (error) {
      console.log(error);
      toast.error("Error Enumerating Vehicle");
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
    getLgas();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="enumeration-form">
        <div className="user-image">
          {details?.driver?.photoUrl ? (
            <img src={details?.driver?.photoUrl} alt="" />
          ) : (
            <LuUser className="user" />
          )}
        </div>
        <FormTextInput
          label={"Driver's Email"}
          name={"email"}
          register={register}
        />
        <FormTextInput
          label={"Driver's ABSSIN"}
          name={"abssin"}
          value={details?.driver.abssin || ""}
        />
        <FormTextInput
          label={"Driver's Name"}
          name={"name"}
          register={register}
          value={details?.driver.driverName || ""}
        />
        <FormTextInput
          label={"Driver's Address"}
          name={"driverAddress"}
          value={details?.driver.driverAddress || ""}
        />
        <FormTextInput
          label={"Phone Number"}
          name={"phone"}
          register={register}
          value={details?.driver.phoneNumber || ""}
        />
        <SelectInput
          label="LGA"
          name="taxpayer_location"
          id="taxpayer_location"
          options={lga}
          placeholder="Select LGA"
          register={register}
          validation={{ required: true }}
        />
        <div className="button-container">
          <button className="button secondary" onClick={() => setStage(1)}>
            Go Back
          </button>
          <Button
            text="Complete Enumerate"
            loading={isPending}
            disabled={isPending}
          />
        </div>
      </form>

      {show && (
        <EnumerationSuccessModal
          qr_link={`https://portal.abiapay.com/verify-asset?assetCode=${ticketData?.assetCode}`}
          plate_number={formData.plate_number || ""}
          text={ticketData?.assetCode || ""}
          id={ticketData?.enumeration_id || ""}
          vehicle_category={formData.vehicle_category || ""}
        />
      )}
    </>
  );
};

export default DriverData;
