import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface CreateMarketEnumerationType {
  taxpayer_category: string,
  abssin: string,
  shop_owner_name: string,
  shop_owner_phone: string,
  shop_number: string,
  shop_category: string,
  revenue_year: string,
  zone_line: string,
  market: string,
  monthly_income_range: string,
  enumeration_fee: string,
  ticket_amount_shop_owner: string,
  ticket_amount_per_occupant: string,
  lga: string,
  payment_method: string,
  merchant_key: string
}

export const fetchMarkets = async () => {
  try {
    const { data } = await axiosInstance.get(`${url}/market`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const createMarketEnumeration = async (requestBody: CreateMarketEnumerationType) => {
  try {
    const { data } = await axiosInstance.post(`${url}/market/market-enumeration`, requestBody);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};