"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { CustomHeader } from "@/src/components/common/header";
import {
  FormTextInput,
  SelectSearchInput,
  SelectInput,
} from "@/src/components/common/input";
import { useForm } from "react-hook-form";
import { Button, CancelButton } from "@/src/components/common/button";
import {
  fetchABSSINInfoWIthPhone,
  fetchLocationState,
  fetchLocationStateLGA,
  fetchSchool,
} from "@/src/services/common";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isBrowser } from "@/src/utils/isBrowser";
import {
  createInfantABSSIN,
  InfantFormData,
} from "@/src/services/identityService";
import FaceCam from "./faceCam";
import CustomDialog from "@/src/components/common/modal/CustomDialog";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { useDebounce } from "@/src/hooks/useDebounce";
import toast from "react-hot-toast";

const CreateInfantAbssinModule = () => {
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
  } | null>();

  useEffect(() => {
    if (isBrowser) {
      const data = window.sessionStorage.getItem("USER_DATA");
      if (data) {
        try {
          setUserData(JSON.parse(data));
        } catch (e) {
          console.error("Error parsing JSON data:", e);
          setUserData({});
        }
      }
    }
  }, []);
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<InfantFormData>({
    defaultValues: {
      agent_email: userData?.email || "",
      state_of_origin: "",
    },
  });

  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (base64Image: string) => {
    setCapturedImage(base64Image);
  };

  const { data: lgaData } = useQuery({
    queryKey: ["lgaData", watch("state_of_origin")],
    queryFn: () =>
      fetchLocationStateLGA({ stateId: watch("state_of_origin") as string }),
  });

  const { data: schools } = useQuery({
    queryKey: ["getSchools"],
    queryFn: fetchSchool,
  });
  const { data: stateData } = useQuery({
    queryKey: ["fetchStates"],
    queryFn: () => fetchLocationState(),
  });

  useEffect(() => {
    if (userData) {
      setValue("agent_email", userData.email || "");
    }
  }, [userData, setValue]);

  const phone = watch("guardian_phone_number");
  const debouncedPhoneNumber = useDebounce(phone, 500);

  useEffect(() => {
    if (debouncedPhoneNumber) {
      const getAbssinDetails = async (phone: string) => {
        try {
          const response = await fetchABSSINInfoWIthPhone({ phone: phone });
          console.log("response", response);
          if (response.response_data.length !== 0) {
            toast.success(response.message ?? "ABSSIN information fetched");
            setValue("guardian_abssin", response.response_data.state_id);
          }
        } catch (error) {
          toast.error("Error fetching ABSSIN information");
        }
      };

      getAbssinDetails(debouncedPhoneNumber);
    }
  }, [debouncedPhoneNumber, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: InfantFormData) => createInfantABSSIN(data),
    onError: (error: any) => {},

    onSuccess: (data: any) => {
      (
        document.getElementById("createInfantABSSINDialog") as HTMLDialogElement
      )?.showModal();
    },
  });

  const onSubmit = (data: InfantFormData) => {
    console.log("data", data);
    mutate({ ...data, image: capturedImage || "" });
  };

  const watchSchoolName = watch("school_name");

  useEffect(() => {
    if (watchSchoolName) {
      console.log("watchSchoolName", watchSchoolName);
      const school = schools?.response_data.find(
        (item: any) => item.id == watchSchoolName
      );

      if (school) {
        setValue("school_address", school.adress + ", " + school.lga);
        console.log("school", school);
      }
    }
  }, [watchSchoolName]);

  return (
    <section>
      <CustomHeader
        title="Create Dependent ABSSIN"
        desc={"Ensure to fill all important fields with (*)"}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="app-container">
          <FaceCam onCapture={handleCapture} />
          {capturedImage && (
            <div className="captured-image mt-4">
              <h2 className="text-lg font-semibold mb-2">Image:</h2>
              <img
                src={capturedImage}
                alt="Captured"
                className="border rounded-lg"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}
        </div>
        <FormTextInput
          label="First Name"
          placeholder="First Name"
          name={"first_name"}
          register={register}
          validation={{ required: true }}
          error={errors.first_name}
        />
        <FormTextInput
          label="Middle Name"
          placeholder="Middle Name"
          name={"middle_name"}
          register={register}
          error={errors.middle_name}
        />
        <FormTextInput
          label="Surname"
          placeholder="Surname"
          name={"surname"}
          register={register}
          validation={{ required: true }}
          error={errors.surname}
        />
        <FormTextInput
          type="date"
          label="Birth Date"
          placeholder="Birth Date"
          name={"birth_date"}
          register={register}
          validation={{ required: true }}
          error={errors.birth_date}
        />
        <SelectInput
          label="Gender"
          placeholder="Gender"
          name={"gender"}
          register={register}
          validation={{ required: true }}
          error={!!errors.gender}
          id={"gender"}
          options={[
            {
              label: "Male",
              value: "male",
            },
            {
              label: "Female",
              value: "female",
            },
          ]}
        />
        <SelectInput
          label="State of Origin"
          placeholder="State of Origin"
          name={"state_of_origin"}
          register={register}
          validation={{ required: true }}
          error={!!errors.state_of_origin}
          id={"state_of_origin"}
          options={
            stateData
              ? stateData?.data.map((state_of_origin: any) => ({
                  label: state_of_origin.state,
                  value: state_of_origin.idstates,
                }))
              : []
          }
        />

        <SelectInput
          label="LGA"
          placeholder="LGA"
          name={"lga"}
          register={register}
          validation={{ required: true }}
          disabled={!watch("state_of_origin")}
          error={!!errors.lga}
          id={"lga"}
          options={
            lgaData
              ? lgaData?.data.map((lga: any) => ({
                  label: lga.name,
                  value: lga.idlga,
                }))
              : []
          }
        />

        <FormTextInput
          type="text"
          label="Student School ID"
          placeholder="Student School ID"
          name={"student_school_id"}
          register={register}
          validation={{ required: true }}
          error={errors.student_school_id}
        />

        <FormTextInput
          label="Guardian Phone Number"
          placeholder="Guardian Phone Number"
          name={"guardian_phone_number"}
          register={register}
          validation={{
            required: true,
            pattern: {
              value: /^\d{11}$/,
              message: "Phone number must be 11 digits",
            },
          }}
          error={errors.guardian_phone_number}
        />

        <FormTextInput
          label="Guardian ABSSIN"
          placeholder="Guardian ABSSIN"
          name={"guardian_abssin"}
          register={register}
          validation={{
            // required: true,
            pattern: {
              value: /^\d{9,11}$/,
              message: "ABSSIN must be between 9 and 11 digits",
            },
          }}
          error={errors.guardian_abssin}
        />

        <SelectSearchInput
          name={"school_name"}
          label={"School Name"}
          options={
            schools
              ? schools?.response_data.map((item: any) => ({
                  value: item.id,
                  label: item.school_name,
                }))
              : []
          }
          control={control}
        />

        <FormTextInput
          label="School Address"
          placeholder="School Address"
          name={"school_address"}
          register={register}
          error={errors.school_address}
        />

        <Button text="Submit" loading={isPending} disabled={isPending} />
      </form>
      <CustomDialog
        id="createInfantABSSINDialog"
        onClose={() =>
          (
            document.getElementById(
              "createInfantABSSINDialog"
            ) as HTMLDialogElement
          )?.close()
        }
      >
        <div className="flex gap-1 items-center justify-center flex-col text-center">
          <TbRosetteDiscountCheckFilled className="text-green-600 text-7xl" />
          <h1 className="text-lg font-semibold">Created Successfully</h1>
          <p className="text-xs md:text-sm text-gray-400 max-w-[14rem]">
            You have successfully created a Dependent ABSSIN
          </p>
          <div className="w-full grid grid-cols-2 gap-2 mt-4">
            <CancelButton link={"/identity"} />
            <Button
              text="Create New"
              onClick={() => {
                (
                  document.getElementById(
                    "createInfantABSSINDialog"
                  ) as HTMLDialogElement
                )?.close();
                reset();
              }}
            />
          </div>
        </div>
      </CustomDialog>
    </section>
  );
};

export default CreateInfantAbssinModule;
