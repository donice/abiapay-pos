import axiosInstance, { https } from "../lib/axiosInstance";

const url = process.env.NEXT_PUBLIC_BASE_URL;
const ibm = process.env.NEXT_PUBLIC_APIC_KEY;

export interface VerifyTicketStatusPayload {
  agentEmail: string;
  referenceID: string;
  verifyType?: string;
  verificationType: string;
  noticeNumber?: string;
  enumerationYear?: string;
  billReference?: string;
  abssin: string;
  referenceType?:string;
  plateNumber?: string;
  enumerationID?: string;
}

export const verifyTicket = async (requestData: VerifyTicketStatusPayload) => {
  try {
    const res = await axiosInstance.post(
      `${url}/transport/verify-ticket`,
      requestData
    );
    console.log("i am in success")
    return res;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error; 
  }
};

export const fetchAssessment = async () => {
  try{
    const {data} = await axiosInstance.get(
      `${url}/transport/assessment-types`
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
}
