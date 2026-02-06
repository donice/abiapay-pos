import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export const fetchTransferHistory = async () => {
  try {
    const { data } = await axiosInstance.post(`${url}/wallet/transfer-history`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transfer history: ${error?.message}`);
  }
};
