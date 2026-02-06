import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";
import { https } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { getErrorMessages } from "../utils/helper";

export const url = process.env.NEXT_PUBLIC_BASE_URL;
const portal_url = process.env.NEXT_PUBLIC_PORTAL_URL;

export type InfantFormData = {
  first_name: string;
  middle_name: string;
  surname: string;
  birth_date: string;
  birth_place: string;
  gender: string;
  lga: number;
  state_of_origin: string;
  guardian_phone_number: string;
  guardian_abssin: string;
  school_name: string;
  school_address: string;
  agent_email: string;
  image: string;
  student_school_id: string;
};


const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export interface validateIdPayloadType {
  id: string;
  source: string;
}

export interface validateNoIdPayloadType {
  value: string;
  verify_via: string;
}

export interface verifyIdOtpPayloadType {
  code: string;
}

export interface verifyNoIdOtpPayloadType {
  otp: string;
}

export interface createIndividualAbssinPayloadType {
  indv_title: string;
  first_name: string;
  middle_name: string;
  surname: string;
  birth_date: string;
  email: string;
  gender: string;
  nin: string;
  nationality: string;
  state_of_origin: string;
  state_of_residence: string;
  marital_status: string;
  bvn: string;
  city: string;
  ward: string;
  address: string;
  lga: string;
  phone_number: string;
  sector: string;
  category: string;
  tax_office: string;
  mobile_number: string;
  image: string;
}

export interface createBusinessAbssinPayloadType {
  coy_name: string;
  regist_name: string;
  companytin: string;
  rcno: string;
  enterprise_reg_no: string;
  category: string;
  mobile_no: string;
  e_mail: string;
  city: string;
  type_of_organisation: string;
  line_of_business: string;
  date_of_incorporation: string;
  sector: string;
  phone_no: string;
  house_no: string;
  street: string;
  lga: string;
  ward: string;
  state: string;
  date_of_commencement: string;
  tax_office: string;
  cdn_category_id: string;
  password: string;
  enter_by: string;
}

export const validateID = async (requestData: validateIdPayloadType) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/abssin/validate-ids`,
      requestData
    );
    return data;
  } catch (error: any) {
    console.log(error);
    toast.error(
      getErrorMessages(error?.data?.message) || "Error validating ID"
    );
    // throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const fetchABSSINStats = async () => {
  try {
    const { data } = await axiosInstance.get(`${url}/abssin/statistics`);
    return data;
  } catch (error: any) {
    console.log(error);
    toast.error(
      getErrorMessages(error?.data?.message) || "Error fetching OTP stats"
    );
    // throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const validateNoID = async (requestData: validateNoIdPayloadType) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/user/otp-request-no-id`,
      requestData
    );
    return data;
  } catch (error: any) {
    console.log(error);
    toast.error(
      getErrorMessages(error?.data?.message) || "Error validating ID"
    );
    // throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const validateIDOtp = async (requestData: verifyIdOtpPayloadType) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/abssin/verify-otp`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const getBVNInfo = async (requestData: { id: string }) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/agent/bvn-info`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const getNINInfo = async (requestData: { id: string }) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/agent/nin-info`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const validateNoIDOtp = async (
  requestData: verifyNoIdOtpPayloadType
) => {
  try {
    const res = await https(`${url}/user/verifying-no-id-otp`, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error: any) {
    console.log(error?.data?.message);
    toast.error(error?.data?.message);
    throw new Error(`${error?.data?.message}`);
  }
};

export const createIndividualAbssin = async (
  requestData: createIndividualAbssinPayloadType
) => {
  try {
    const data = await https(`${url}/abssin/register-abssin-individual`, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          window.sessionStorage.getItem("TOKEN") || isToken || ""
        }`,
      },
    });

    return data;
  } catch (error: any) {
    toast.error(
      getErrorMessages(error?.data?.response_message) ||
        "Error creating individual abssin account"
    );
    console.log(error);
    throw new Error(`Error fetching transactions: ${error}`);
  }
};

export const createInfantABSSIN = async (
  requestData: InfantFormData
) => {
  try {
    const data = await https(`${portal_url}/user/create-infant`, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          window.sessionStorage.getItem("TOKEN") || isToken || ""
        }`,
      },
    });

    return data;
  } catch (error: any) {
    console.log(error?.data);
    toast.error(
      getErrorMessages(error?.data) ||
        "Error creating individual abssin account"
    );
    console.log(error);
    throw new Error(`Error fetching transactions: ${error}`);
  }
};

export const createBusinessAbssin = async (
  requestData: createBusinessAbssinPayloadType
) => {
  try {
    const data = await https(`${url}/abssin/register-abssin-business`, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error: any) {
    toast.error(
      getErrorMessages(error?.data?.response_message) ||
        "Error creating individual abssin account"
    );
    console.log(error);
    throw new Error(`Error fetching transactions: ${error}`);
  }
};

export const getIndividualABSSINs = async () => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/abssin/manage-individual`
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const getBusinessABSSINs = async () => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/abssin/manage-business`
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const postRegisterBulkAbssin = async ({file}: {file: any}) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/abssin/bulk-school-registration`, {
        file: file
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
