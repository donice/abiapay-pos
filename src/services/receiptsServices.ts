import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface FetchBillPayload {
  bill_ref: string;
}

export interface BillPaymentPayload {
  notice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  account_type: string;
}

export const fetchReceipts = async () => {
  try {
    const { data } = await axiosInstance.get(`${url}/collections/receipts`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
