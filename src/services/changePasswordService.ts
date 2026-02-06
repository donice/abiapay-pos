import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";
import toast from "react-hot-toast";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface changePasswordOTPType{
  email: string
}

export interface changePasswordType{
  otp: string,
  password: string
}

export const changePasswordOTP = async (requestData: changePasswordOTPType) => {
  try {
    const { data } = await axiosInstance.post(`${url}/user/forgot-password`, requestData);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
export const changePasswordAPI = async (requestData: changePasswordType) => {
  try {
    const { data } = await axiosInstance.post(`${url}/user/forgot-password-otp-verification`, requestData);
    return data;
  } catch (error: any) {
    console.log(error?.response?.data?.message);
    toast.error(error?.response?.data?.message || "Error validating OTP")
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};