import axiosInstance from "../lib/axiosInstance";

const url = process.env.NEXT_PUBLIC_BASE_URL;


export interface generateDemandNoticePayload {
    taxpayerID: string;

  }

  export interface searchDemandNoticePayload {
    notice_number: string;
    merchant_key:string;
  };

   export interface assignDemandNoticePayload {
    notice_number: string;
    abssin:string;
    merchant_key:string;
    geolocation:string
  };

   export interface assignNoAbssinDemandNoticePayload {
    merchant_key: string,
  company_name: string,
  company_phone_number: string,
  company_address_street: string,
  company_house_no: string,
  lga: string,
  notice_number: string,
  geolocation:string

  };

  export interface fetchDemandNoticePayload {
    notice_number: string;
    merchant_key:string;
  };

  export interface createDemandNoticePayload {
   taxpayer_id: [
    {
      id: string
    }
  ],
  cdn_category_id?: number,
  createdby?: string,
  fiscal_year?: string
}

export interface fetchBusinessAbssinPayload {
  state_id: string;
}

export interface searchCompanyPayload {
  search_term: string;
}


  export const searchDemandNotice = async (requestData: searchDemandNoticePayload) => {
    try {
      const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_CENTRAL_URL}/cdn/fetch-demand-notice`,requestData);
  
      return res;
    } catch (error: any) {
      return {
        error: error.response?.data?.message || "Failed to fetch demand notice",
      };
    }
  };

  export const searchCompany = async (requestData: searchCompanyPayload) => {
  try {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_CENTRAL_URL}/cdn/search-company`,
      requestData  
    );
    return res?.data;
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "Failed to search company",
    };
  }
};

  

  export const assignDemandNotice = async (requestData: assignDemandNoticePayload) => {
    try {
      const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_CENTRAL_URL}/cdn/assign-abssin-demand-notice`,requestData);
  
      return res;
    } catch (error: any) {
      return {
        error: error.response?.data?.message || "Failed to fetch demand notice",
      };
    }
  };

   export const assignnoAbssinDemandNotice = async (requestData: assignNoAbssinDemandNoticePayload) => {
    try {
      const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_CENTRAL_URL}/cdn/assign-demand-notice`,requestData);
  
      return res;
    } catch (error: any) {
      return {
        error: error.response?.data?.message || "Failed to fetch demand notice",
      };
    }
  };

   export const fetchDemandNotice = async (requestData: fetchDemandNoticePayload) => {
    try {
      const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_CENTRAL_URL}/cdn/fetch-demand-notice`,requestData);
  
      return res;
    } catch (error: any) {
      return {
        error: error.response?.data?.message || "Failed to fetch demand notice",
      };
    }
  };



  export const fetchBusinessAbssin = async (
    requestBody: fetchBusinessAbssinPayload
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${url}/abssin/fetch-business-abssin`,
        requestBody 
      );
      return data;
    } catch (error: any) {
      throw new Error(`Error fetching Business Abssin: ${error?.message}`);
    }
  };

  export const createDemandNotice = async (
    requestBody: createDemandNoticePayload
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${url}/cdn/create-demand-notice`,
        requestBody 
      );
      return data;
    } catch (error: any) {
      throw new Error(`Error creating Demand Notice: ${error?.message}`);
    }
  };
  