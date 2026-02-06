import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;
const portal_url = process.env.NEXT_PUBLIC_PORTAL_URL;
const portal_url_2 = process.env.NEXT_PUBLIC_PORTAL_URL_2;
const central_api_url = process.env.NEXT_PUBLIC_CENTRAL_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);


export const fetchBanks = async () => {
  try {
    const res = await axiosInstance.post(`${url}/banks`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchABSSINInfo = async (reqData: {
  id: string
}) => {
  try {
    const res = await axiosInstance.post(`${url}/abssin/abssin-info`, reqData);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchABSSINInfoWIthPhone = async (reqData: {
  phone: string
}) => {
  try {
    const res = await axiosInstance.post(`${portal_url_2}/user/individual/phone`, reqData);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchLGAData = async () => {
  try {
    const res = await axiosInstance.post(`${url}/state/lga`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchStates = async () => {
  try {
    const res = await axiosInstance.post(`${url}/state`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchLocationStateLGA = async ({stateId}: { stateId: string}) => {
  try {
    const res = await axiosInstance.get(`${portal_url_2}/location/states/lga?stateId=${stateId}`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchLocationState = async () => {
  try {
    const res = await axiosInstance.get(`${portal_url_2}/location/states`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchVehicleCategories = async () => {
  try {
    const res = await axiosInstance.get(`${portal_url}/enumeration/vehicle-category`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchParks = async () => {
  try {
    const res = await axiosInstance.get(`${url}/parks`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchTradeUnions = async () => {
  try {
    const res = await axiosInstance.get(`${url}/enumeration/unions`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchProducts = async () => {
  try {
    const res = await axiosInstance.get(`${central_api_url}/agent/product-code`);
    return res;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchTaxOffice = async () => {
  try {
    const res = await axiosInstance.post(`${portal_url}/user/station`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchSchool = async () => {
  try {
    // const res = await axiosInstance.get(`https://portalapi.abiapay.com/api/v1/user/school-list`);
    const res = await axiosInstance.get(`${portal_url_2}/user/school-list`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchCategory = async () => {
  try {
    const res = await axiosInstance.post(`${portal_url}/cdn/category`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchVehicleCategory = async () => {
  try {
    const res = await axiosInstance.get(`${portal_url}/enumeration/vehicle-category`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchSector = async () => {
  try {
    const res = await axiosInstance.get(`${portal_url}/user/sector`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchBusinessType = async () => {
  try {
    const res = await axiosInstance.get(`${portal_url}/user/business-type`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const fetchOrganization = async () => {
  try {
    const res = await axiosInstance.get(`${portal_url}/user/sector`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
}