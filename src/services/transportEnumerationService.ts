import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;
const central_api_url = process.env.NEXT_PUBLIC_CENTRAL_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface VerifyPlateNumberType {
  phone_number: string,
  plate_number: string,
  merchant_key: string
}

export interface SaveVehicleDetailsProps {
  plate_number: string,
  owner_phone_number: string,
  vehicle_make: string,
  vehicle_model: string,
  engine_number: string,
  chassis_number: string,
  owner_name: string,
  owner_address: string,
  vehicleStatus: string,
  vehicle_color: string,
  state_of_registration: string,
  expiry_date: string,
  merchant_key: string
}

export interface CreateTicketType {
  taxpayer_category: string,
  abssin: string,
  vehicle_plate_number: string,
  taxpayer_name: string,
  taxpayer_phone: string,
  revenue_year: string,
  taxpayer_location: string,
  operating_park: string,
  trade_union: string,
  vehicle_category: string,
  owner_name: string,
  owner_address: string,
  daily_ticket_amount: number | string,
  enumeration_fee: string,
  merchant_key: string
}

export interface SaveContactType {
  email: string,
  name: string,
  phone: string,
  plate_number: string,
  contact_type: string,
  merchant_key: string
}

export const verifyPlateNumber = async (requestBody: VerifyPlateNumberType) => {
  try {
    const { data } = await axiosInstance.post(`${url}/vehicle/verify-plate-number`, requestBody);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const saveVehicleDetails = async (requestBody: SaveVehicleDetailsProps) => {
  try {
    const { data } = await axiosInstance.post(`${url}/vehicle/save-vehicle-details`, requestBody);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const createTransportEnumeration = async (requestBody: CreateTicketType) => {
  try {
    const { data } = await axiosInstance.post(`${url}/enumeration/create-transport-enumeration`, requestBody);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const saveContact = async (requestBody: SaveContactType) => {
  try {
    const { data } = await axiosInstance.post(`${url}/contact/save`, requestBody);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const fetchCompletedTransportEnumeration = async () => {
  try {
    const { data } = await axiosInstance.post(`${url}/enumeration/completed-transport`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const fetchProductCode = async () => {
  try {
    const { data } = await axiosInstance.get(`${url}/transport/emblem-product-code`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching products: ${error?.message}`);
  }
};

export const fetchVehicleCategory = async () => {
  try {
    const data  = await axiosInstance.get(`${central_api_url}/agent/product-code`);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching products: ${error?.message}`);
  }
};



