import React, { useState } from "react";
import { FormTextInput } from "@/src/components/common/input";
import { BackButton, Button } from "@/src/components/common/button";
import { CustomHeader } from "@/src/components/common/header";
import "../../style.scss";
import { useMutation } from "@tanstack/react-query";
import { validateIDOtp, validateNoIDOtp } from "@/src/services/identityService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { OtpSuccessModal } from "@/src/components/common/modal";
import Unauthorized from "@/src/components/common/unauthorized";

const ValidateOtpComponent = () => {
  const querySearch = useSearchParams();
  const source = querySearch.get("source");
  const _id = querySearch.get("_id");

  const [show, setShow] = useState({
    mode: false,
    message: "",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["verify_otp_for_abssin_creation"],
    mutationFn:
      source == "No ID"
        ? (data: any) => {
            return validateNoIDOtp(data);
          }
        : (data: any) => {
            return validateIDOtp(data);
          },
    onSuccess: (data: any) => {
      console.log("DATA", data);
      source == "No ID"
      ?  data.status == true && setShow({ mode: true, message: data.message }) 
      :  data.status == true
        ? toast.success(data.response_message) && setShow({ mode: true, message: data.response_message })
        : toast.error(data.response_message);
    },

    onError: (error: any) => {
      console.log("ERROR DATA", error);
      return error;
    },
  });

  const {
    register: registerNoID,
    handleSubmit: handleSubmitNoID,
    formState: { errors: errorsNoID },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const {
    register: registerID,
    handleSubmit: handleSubmitID,
    formState: { errors: errorsID },
  } = useForm({
    defaultValues: {
      code: "",
    },
  });


  const onsubmit = (data: any) => {
    mutate(data);
  };

  return (
    <>
      {source ? (
        <div>
          <CustomHeader
            title={"Validate OTP"}
            desc={"Enter token to validate ID"}
          />
          <form
            onSubmit={
              source == "No ID"
                ? handleSubmitNoID(onsubmit)
                : handleSubmitID(onsubmit)
            }
            className="identity-form"
          >
            {source == "No ID" ? (
              <FormTextInput
                label={"OTP"}
                name="otp"
                type="password"
                placeholder={"Enter OTP"}
                register={registerNoID}
                error={errorsNoID.otp}
              />
            ) : (
              <FormTextInput
                label={"OTP Token"}
                name="code"
                type="password"
                placeholder={"Enter OTP Token"}
                register={registerID}
                error={errorsID.code}
              />
            )}
            <div className="button-container">
              <BackButton link="/identity/create/individual/verify" />
              <Button
              text={"Validate OTP"}
              loading={isPending}
              disabled={isPending}
            />
            </div>
            
          </form>

          {show.mode && (
            <OtpSuccessModal
            mode="verified"
              maintext={`${show?.message}`}
              subtext="Click 'Continue' to proceed your ABSSIN creation" 
              buttontext="Continue"
              link={`/identity/create/individual?source=${source}&_id=${_id}`}
            />
          )}
        </div>
      ) : (
        <div>
          <Unauthorized text="You don't have access to this page"/>
        </div>
      )}{" "}


    </>
  );
};

export default ValidateOtpComponent;
