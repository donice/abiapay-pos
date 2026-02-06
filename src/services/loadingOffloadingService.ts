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

export interface LoadingOffloadingType {
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
  next_payment_date: string,
  amount: string
}

export interface EmblemProduct {
  id: number;
  merchant_id: string;
  business_type: string;
  productCode: string;
  productTag: string;
  planCode: string;
  productName: string;
  category: string;
  amount: string;
  dailyAmount: string;
  weeklyAmount: string;
  monthlyAmount: string;
  emblem: string;
  presumptivetax: string;
  penalty: string;
  penalty_daily: string;
  status: string;
}

export const fetchLoadingOffloadingVehicleType = async ( )=> {
  try {
    const { data } = await axiosInstance.get(`${centralapi_url}/agent/concessionaires-product-codes?category=LoadingOffloading`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const createLoadingOffLoading = async ( reqData: LoadingOffloadingType )=> {
  try {
    const { data } = await axiosInstance.post(`${url}/ticket/loading-offloading`, reqData);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};