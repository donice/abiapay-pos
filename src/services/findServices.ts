import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);


export interface FetchTransactionsUsingPhoneNumberRequest {
  merchant_key: string;
  phone_number: string;
  page: number;
  limit: number;
}

export interface FetchTransactionsUsingPlateNumberRequest {
  merchant_key: string;
  plate_number: string;
  page: number;
  limit: number;
}

export const fetchTransactionsUsingPhoneNumber = async (requestData: FetchTransactionsUsingPhoneNumberRequest) => {
  try {
    const { data } = await axiosInstance.post(`${url}/transport/fetch-transactions-by-phone-number`, requestData);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const fetchTransactionsUsingPlateeNumber = async (requestData: FetchTransactionsUsingPlateNumberRequest) => {
  try {
    const { data } = await axiosInstance.post(`${url}/transport/fetch-transactions-by-plate-number`, requestData);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
