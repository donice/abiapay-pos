import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export const fetchDashboardData = async () => {
  try {
    const res = await axiosInstance.post(`${url}/dashboard/data`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchABSSINData = async () => {
  try {
    const res = await axiosInstance.post(`${url}/abssin/manage-abssin`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchTotalABSSIN = async () => {
  try {
    const res = await axiosInstance.post(`${url}/abssin/manage-individual`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchEnumerationData = async () => {
  try {
    const res = await axiosInstance.get(`${url}/enumeration/statistics`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
};


export const fetchCollectionData = async () => {
  try {
    const res = await axiosInstance.get(`${url}/enumeration/total-collected`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchTransportTicketData = async () => {
  try {
    const res = await axiosInstance.post(`${url}/transport/completed-transactions`);
    return res.data;
  } catch (error: any) {
    console.log(error);
  }
};
