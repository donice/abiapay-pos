import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";
import { ABSAAPayload } from "../components/types/absaaTypes";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export const createFirstPartySignage = async (requestData: ABSAAPayload) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/absaa/create`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

