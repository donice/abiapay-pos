import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export const BuyAirtimeService = async (reqData: {
  amount: number,
  phone_number: string,
  network: string,
  wallet: string
}) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/topup/buy-airtime`,
      {
        ...reqData,
        merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY,
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
export const BuyDataService = async (reqData: {
  amount: number,
  phone_number: string,
  tarrifTypeId: string,
  network: string,
  wallet: string
}) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/topup/buy-data`,
      {
        ...reqData,
        merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY,
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const GetDataPlans = async (reqData: {
  network: string,
}) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/topup/data`,
      {
        ...reqData,
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
