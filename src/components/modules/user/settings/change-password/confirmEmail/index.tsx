import { Button } from "@/src/components/common/button";
import { FormTextInput } from "@/src/components/common/input";
import { EmailSuccessModal } from "@/src/components/common/modal";
import {
  changePasswordOTPType,
  changePasswordOTP,
} from "@/src/services/changePasswordService";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ConfirmEmail = ({ setStage, setFormData }: any) => {
  const [modal, setModal] = useState({
    open: false,
    message: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: changePasswordOTPType) => {
      return changePasswordOTP(data);
    },
    mutationKey: ["change-password"],
    onSuccess: (data) => {
      if (data) {
        toast.success("OTP sent");
        // setStage(1);
        console.log(data.message);
        setModal({
          open: true,
          message: data.message,
        });

      } else {
        toast.error("Password Change Failed");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error");
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (reqData: changePasswordOTPType) => {
    mutate(reqData);
    setFormData({...reqData});
  };
  return (
    <section className="change-password">
      <form onSubmit={handleSubmit(onSubmit)} className="change-password_form">
        <FormTextInput
          label={"Agent's Email"}
          name={"email"}
          placeholder="Enter agent's email"
          type="text"
          register={register}
          validation={{ required: true }}
          error={errors.email}
        />
        <Button text="Send OTP" loading={isPending} />
      </form>

      {modal.open === true && <EmailSuccessModal text={modal.message} buttonText="Validate OTP" onClick={() => setStage(1)}/>}
    </section>
  );
};

export default ConfirmEmail;
