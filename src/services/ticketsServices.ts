import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";
import {
  CreateGroupSportPayload,
  CreateIndividualSportPayload,
  CreateManifestPayloadType,
  CreateTicketPayload,
} from "../components/types/ticketTypes";

const url = process.env.NEXT_PUBLIC_BASE_URL;
const portal_url = process.env.NEXT_PUBLIC_PORTAL_URL;
const centralapi_url = process.env.NEXT_PUBLIC_CENTRAL_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface Product {
  productCode: string;
  productName: string;
  dailyAmount: number;
  weeklyAmount: number;
  monthlyAmount: number;
}

export interface MarketLevyType {
  taxpayer_name: string,
  abssin: string,
  taxpayer_phone: string,
  zone_line: string,
  market_id: string,
  shop_number: string,
  payment_period: string,
  merchant_key: string,
  wallet_type: string
}

export interface TransactionsTypes {
  page: number;
  limit: number;
}

export interface ResendSMSPayload {
  payment_ref: string;
}

export const createNewTicket = async (requestData: CreateTicketPayload) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/transport/create-ticket`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const createManifest = async (requestData: CreateManifestPayloadType) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/transport/create-manifest`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const createIndividualSportTicket = async (
  requestData: CreateIndividualSportPayload
) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/sport/create-individual-ticket`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const createGroupSportTicket = async (
  requestData: CreateGroupSportPayload
) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/sport/create-group-ticket`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const resendSMS = async (requestData: ResendSMSPayload) => {
  try {
    const { data } = await axiosInstance.post(
      `${centralapi_url}/wallet/resend-sms`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const fetchTransactions = async () => {
  try {
    const { data } = await axiosInstance.post(`${url}/transport/transactions`, {
      page: 1,
      limit: 200,
    });
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const fetchAllEmblem = async () => {
  try {
    const { data } = await axiosInstance.post(`${url}/transport/fetch-emblem`, {
      page: 1,
      limit: 200,
    });
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const fetchSingleEmblem = async (ref: string) => {
  try {
    const { data } = await axiosInstance.get(`${url}/transport/search-emblem?ref=${ref}`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const retryPayment = async (reqData: { payment_ref: string }) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/wallet/access-reproccess-debit`,
      {
        payment_ref: reqData?.payment_ref,
        merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY,
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const fetchPlateNumberInfo = async (plate_number: string) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/transport/get-plate-number-info`,
      { plate_number: plate_number }
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

// MARKET ENUMERATION LEVY

export const fetchMarkets = async () => {
  try {
    const { data } = await axiosInstance.get(`${url}/market`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
export const fetchMarketEnumerationDetails = async ({enumeration_id}: { enumeration_id: string }) => {
  try {
    const { data } = await axiosInstance.post(`${portal_url}/payment/enumeration`, {
      enumeration_id: enumeration_id,
    });
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const postPayForMarketLevy = async (reqData: MarketLevyType) => {
  try {
    const { data } = await axiosInstance.post(`${url}/market/market-ticket`, reqData);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
