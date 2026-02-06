import React, { useEffect, useState } from "react";
import { Button } from "@/src/components/common/button";
import { FormTextInput, SelectInput } from "@/src/components/common/input";
import { FieldError, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  fetchProductCode,
  fetchVehicleCategory,
  verifyPlateNumber,
  VerifyPlateNumberType,
} from "@/src/services/transportEnumerationService";
import toast from "react-hot-toast";
import {
  ErrorModal,
  InfoModal,
  VehicleCheckSuccessModal,
} from "@/src/components/common/modal";
import { fetchParks, fetchTradeUnions } from "@/src/services/common";

const VehicleData = ({ setStage, setDetails, setFormData, formData }: any) => {
  const [parks, setParks] = useState([]);
  const [tradeUnions, setTradeUnions] = useState([]);
  const [vehicleCategory, setVehicleCategory] = useState([]);
  const [modalDetails, setModalDetails] = useState({
    vehicle_make: "",
    vehicle_model: "",
    vehicle_color: "",
    state_of_registration: "",
    expiry_date: "",
  });
  const [show, setShow] = useState({
    mode: false,
    user: "",
    status: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY || "",
      plate_number: formData.plate_number || "",
      phone_number: formData.phone_number || "",
      vehicle_category: formData.vehicle_category || "",
      trade_union: formData.trade_union || "",
      operating_park: formData.operating_park || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: VerifyPlateNumberType) => {
      return verifyPlateNumber(data);
    },
    mutationKey: ["verify_plate_number"],
    onSuccess: (data) => {
      if (data.response_code == "00") {
        if (
          Object.keys(data?.response_data?.driver).length < 1 ||
          data.response_data?.driver.abssin == "" ||
          data.response_data?.vehicle_owner.abssin == ""
        ) {
          setShow({
            mode: true,
            status: "",
            user:
              Object.keys(data?.response_data?.driver).length < 1
                ? "Driver"
                : data.response_data?.vehicle_owner.abssin == ""
                ? "Vehicle Owner"
                : "Driver & Vehicle Owner",
          });
        } else {
          toast.success("Plate Number Verified Successfully");
          setShow({ mode: true, status: "success", user: "" });
          setDetails(data?.response_data);
          setModalDetails(data?.response_data?.vehicle_data);
        }

        // setStage(1);
      } else if (data.response_code == "12") {
        toast.success(data.response_message);
      } else {
        toast.error("Error Verifying Plate Number");
        setShow({ mode: true, status: "error", user: "" });
      }
    },
    onError: (error) => {
      toast.error("Error Verifying Plate Number");
      reset();
      console.log(error);
    },
  });

  const onSubmit = (reqData: any) => {
    mutate(reqData);
    setFormData(reqData);
  };

  const getVehicleCategories = async () => {
    try {
      const { data } = await fetchVehicleCategory();
      console.log(data, "PRODUCT CODE");
      const res = data?.map((item: any) => {
        return {
          label: item.productName,
          value: item.productCode,
        };
      });
      setVehicleCategory(res);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getParks = async () => {
    try {
      const data = await fetchParks();
      const res = data?.map((item: any) => {
        return {
          label: item.park,
          value: item.park,
        };
      });
      setParks(res);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getTradeUnions = async () => {
    try {
      const data = await fetchTradeUnions();
      const res = data?.map((item: any) => {
        return {
          label: item.unionCode,
          value: item.unionName,
        };
      });
      setTradeUnions(res);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getParks();
    getTradeUnions();
    getVehicleCategories();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="enumeration-form">
        <FormTextInput
          label="Driver's Phone Number (e.g 08123456789)"
          type="number"
          name="phone_number"
          placeholder="Enter Driver's Phone Number"
          register={register}
          validation={{
            required: "Phon Number is Required",
            minLength: {
              value: 11,
              message: "Length must be above 11 characters",
            },
            maxLength: {
              value: 11,
              message: "Length must be below 13 characters",
            },
          }}
          error={errors.phone_number as FieldError}
        />
        <FormTextInput
          label="Vehicle Plate Number"
          type="text"
          name="plate_number"
          placeholder="Enter Vehicle Plate Number"
          register={register}
          validation={{
            required: "Vehicle Number is Required",
            maxLength: {
              value: 8,
              message: "Length must be below 13 characters",
              setValueAs: (value: string) => value.toUpperCase(),
            },
          }}
          error={errors.plate_number as FieldError}
        />
        <SelectInput
          label="Vehicle Category"
          name="vehicle_category"
          id="vehicle_category"
          options={vehicleCategory}
          placeholder="Select Vehicle Category"
          register={register}
          validation={{ required: true }}
        />
        <SelectInput
          label="Operating Park"
          name="operating_park"
          id="operating_park"
          options={parks}
          placeholder="Select Operating Park"
          register={register}
          validation={{ required: true }}
        />
        <SelectInput
          label="Trade Unions"
          name="trade_union"
          id="trade_union"
          options={tradeUnions}
          placeholder="Select Trade Unions"
          register={register}
          validation={{ required: true }}
        />
        <Button text="Save & Continue" loading={isPending} />
      </form>

      {show.mode === true && (
        <ErrorModal
          text_header={`Error Validating ${show.user} ABSSIN`}
          button_text="Create ABSSIN"
          link="/identity/create/individual/verify"
          text_info={`To proceed, kindly click "Create ABSSIN" to create ${show.user} ABSSIN`}
          status={"error"}
        />
      )}
      {show.mode && show.status == "error" && (
        <InfoModal
          status={show.status}
          text_header="Vehicle Information Not Found"
          button_text="Enter Vehicle Details"
          link="/enumeration/transport/save"
          text_info={`Cannot Proceed. Please Register Vehicle Details`}
        />
      )}
      {show.mode && show.status == "success" && (
        <VehicleCheckSuccessModal
          text_header="Information Retrieved Successfully"
          vehicle_make={modalDetails.vehicle_make}
          vehicle_model={modalDetails.vehicle_model}
          vehicle_color={modalDetails.vehicle_color}
          state_of_registration={modalDetails.state_of_registration}
          expiry_date={modalDetails.expiry_date}
          button_text="Continue"
          onClick={() => {
            setShow({ mode: false, status: "", user: "" });
            setStage(1);
          }}
        />
      )}
    </div>
  );
};

export default VehicleData;
