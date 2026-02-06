import { Button } from "@/src/components/common/button";
import { FormTextInput } from "@/src/components/common/input";
import {
  ChangePasswordModal,
  SuccessModal,
} from "@/src/components/common/modal";
import {
  changePasswordAPI,
  changePasswordType,
} from "@/src/services/changePasswordService";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ValidateOTP = ({ setStage, setFormData, formData }: any) => {
  const [modal, setModal] = useState({
    open: false,
    message: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: changePasswordType) => {
      return changePasswordAPI(data);
    },
    mutationKey: ["change-password"],
    onSuccess: (data) => {
      if (data.status == true) {
        toast.success(data.message || "Password Changed Successfully");
        setModal({
          open: true,
          message: data.message,
        });
      } else {
        toast.error("Error changing password");
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (reqData: { password: string; confirmPassword: string }) => {
    console.log(reqData);
    setFormData({ ...formData, ...reqData });
    mutate({ otp: formData.otp, password: reqData.password });
  };

  // Watch the password field for comparison with confirmPassword
  const password = watch("password");

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="change-password_form">
        <FormTextInput
          label={"New Password"}
          name={"password"}
          register={register}
          placeholder={`Enter New Password for ${formData.email}`}
          type="password"
          error={errors.password}
          validation={{
            required: true,
            minLength: {
              value: 8,
              message: "Length must be above 8 characters",
            },
          }}
        />

        <FormTextInput
          label={"Confirm New Password"}
          name={"confirmPassword"}
          register={register}
          placeholder="Confirm New Password"
          type="password"
          error={errors.confirmPassword}
          validation={{
            required: "Confirm Password is required",
            validate: (value: string) =>
              value === password || "Passwords do not match",
          }}
        />

        <div className="button-container">
          <button className="button secondary" onClick={() => setStage(1)}>
            Edit OTP
          </button>
          <Button text="Change Password" loading={isPending} />
        </div>
      </form>

      {modal.open === true && (
        <ChangePasswordModal
          maintext={modal.message}
          id={"Changed Successfully"}
          onClick={() => setStage(1)}
          link="/dashboard"
          text="Done"
        />
      )}
    </div>
  );
};

export default ValidateOTP;
