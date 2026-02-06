import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;
const centralapi_url = process.env.NEXT_PUBLIC_CENTRAL_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface FlyingRevenuePayload {
  merchant_key: string,
  penalty_status: string,
  total_number: string,
  vehicle_content: string,
  product_code: string,
  category: string,
  tax_payer_phone: string,
  tax_payer_name: string,
  plate_number: string,
  collection_point: string,
  payment_period: string,
  wallet_type: string,
  amount: string
}

export const createFlyingRevenue = async ( reqData: FlyingRevenuePayload )=> {
  try {
    const { data } = await axiosInstance.post(`${url}/transport/create-haulage`, reqData);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const fetchTonnage = async ( reqData: string | undefined )=> {
  try {
    const { data } = await axiosInstance.get(`${centralapi_url}/agent/concessionaires-product-codes?category=${reqData}` );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching Tonnage: ${error?.message}`);
  }
};