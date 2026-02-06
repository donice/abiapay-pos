"use client";
import React, { useState, useEffect } from "react";
import { FormButton } from "@/src/components/common/button";
import { TextInput } from "@/src/components/common/input";
import "./style.scss";
import toast from "react-hot-toast";
import { login, useAuthDispatch } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

interface FormData {
  email: string;
  password: string;
}

const AgentSigninForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useAuthDispatch();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      login(dispatch, data),
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error("Error Loging in");
      console.error("Login failed:", error);
    },
  });

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (field) => field !== ""
    );
    setIsFormValid(allFieldsFilled);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    mutation.mutate(formData);

    // setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="signin_form">
      <TextInput
        label="Email"
        type="email"
        name="email"
        placeholder="Enter Email"
        value={formData.email}
        onChange={handleChange}
      />
      <TextInput
        label="Password"
        type="password"
        name="password"
        placeholder="Enter Password"
        value={formData.password}
        onChange={handleChange}
      />
      <div className="btn_container">
        <FormButton
          loading={loading}
          text="Sign in"
          disabled={!isFormValid || loading}
        />
      </div>{" "}

      <div className="bottom_links">
        <div
          className="forgot-password link"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password?
        </div>

        <div className="forgot-password">
          Are you an MDA?{" "}
          <span onClick={() => router.push("/signin/mda")} className="link">
            Click here to sign in
          </span>{" "}
        </div>
      </div>
    </form>
  );
};

export default AgentSigninForm;
