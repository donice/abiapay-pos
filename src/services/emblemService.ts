import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface CreateTransportEmblemType {
  customer_name: string;
  customer_email: string;
  taxpayer_phone: string;
  amount: string;
  product_code: string;
  payment_method: string;
  merchant_key: string;
  payment_period: string;
  description: string;
  plate_number: string;
  lga: string;
  wallet_type: string;
}

export const fetchEmblemProductCode = async ()=> {
  try {
    const { data } = await axiosInstance.get(`${url}/transport/emblem-product-code`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const createTransportEmblem = async ( reqData: CreateTransportEmblemType )=> {
  try {
    const { data } = await axiosInstance.post(`${url}/transport/create-transport-emblem`, reqData);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};