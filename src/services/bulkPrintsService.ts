import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface FetchBulkPrintsPayload {
  category: string;
  lga: number;
  card_type: string;
  no_of_cards: number;
  page: number;
  start_date: string;
  end_date: string;
}

export interface SearchBulkPrintsPayload {
  ref: string;
}

export interface SearchBulkPrintsGroupPayload {
  plate_number: string;
  card_type: string;
  no_of_cards: number;
  page: number;
}


// Bulk print (group fetch)
export const fetchBulkPrintsData = async (reqData: FetchBulkPrintsPayload) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/enumeration/print-filter`,
      reqData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching bulk prints: ${error?.message}`);
  }
};

// Single search by ref (single ABSSIN)
export const searchBulkPrintsData = async (payload: SearchBulkPrintsPayload) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/enumeration/print/search`,
      payload
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error searching prints: ${error?.message}`);
  }
};

// Group search (for batch printing)
export const searchBulkPrintsGroupData = async (
  payload: SearchBulkPrintsGroupPayload
) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/enumeration/print/group`,
      payload
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error searching print group: ${error?.message}`);
  }
};
