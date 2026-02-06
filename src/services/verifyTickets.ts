import axiosInstance, { https } from "../lib/axiosInstance";

const url = process.env.NEXT_PUBLIC_BASE_URL;
const ibm = process.env.NEXT_PUBLIC_APIC_KEY;

export interface VerifyTicketPayload {
  agentEmail: string;
  referenceID: string;
  verifyType?: string;
}

export const verifyTicket = async (requestData: VerifyTicketPayload) => {
  try {
    const res = await axiosInstance.post(
      `${url}/transport/verify-ticket`,
      requestData
    );

    return res;
  } catch (error: any) {
    return {
      error: error.data
    }
  }
};

