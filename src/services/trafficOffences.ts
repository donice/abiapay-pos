import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;
const portal_url = process.env.NEXT_PUBLIC_PORTAL_URL;
const centralapi_url = process.env.NEXT_PUBLIC_CENTRAL_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface Offences {
    title: string;
    description: string;
    fee: number;
    point: number;
    violation_type: string;
    code: string;
    id:number;
  }

export interface CreateOffencePayload {
    merchant_key: string,
    amount: string,
    plate_number: string,
    vehicle_type: string,
    taxpayer_name: string,
    taxpayer_phone: string,
    offence_type: string,
    wallet_type: string
}

export interface SearchOffencePayload {
  search_value: string,
  search_by: string
}

export interface fetchOffenceHistoryPayload {
  email: string
}

export const createTrafficoffence = async (requestData: CreateOffencePayload) => {
    try {
      const { data } = await axiosInstance.post(
        `${url}/enforcer/traffic-offence/create`,
        requestData
      );
      return data;
    } catch (error: any) {
      throw new Error(`Error fetching transactions: ${error?.message}`);
    }
};

export const searchOffence = async (requestData: SearchOffencePayload) => {
    try {
      const { data } = await axiosInstance.post(
        `${url}/enforcer/traffic-offence/search`,
        requestData
      );
      return data;
    } catch (error: any) {
      throw new Error(`Error fetching transactions: ${error?.message}`);
    }
};

export const fetchAllOffences = async () => {
  try {
    const res = await axiosInstance.get(`${url}/enforcer/all-traffic-offences`);
    console.log(res.data, "VERIFICATION TYPE");
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchOffenceHistory = async (requestData: fetchOffenceHistoryPayload) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/enforcer/traffic-offence/agent`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching history: ${error?.message}`);
  }
};