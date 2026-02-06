import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;
const portal_url = process.env.NEXT_PUBLIC_PORTAL_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface verifyVehicleEnumrationPayload {
  plate_number: string;
}

export interface verifyVehicleStatusPayload {
  ref: string;
}
export const verifyVehicleStatus = async (
  requestData: verifyVehicleStatusPayload
) => {
  try {
    const { data } = await axiosInstance.post(
      `${portal_url}/assets/get-vehicle`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const verifyVehicleEnumeration = async (
  requestData: verifyVehicleEnumrationPayload
) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/enumeration/enumeration-details`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
