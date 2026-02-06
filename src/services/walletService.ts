import axiosInstance from "../lib/axiosInstance";
import { isBrowser } from "@/src/utils/isBrowser";
import { setToken } from "./setToken";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const isToken =
  isBrowser && window.sessionStorage.getItem("TOKEN")
    ? window.sessionStorage.getItem("TOKEN")
    : null;
setToken(isToken);

export type WalletToWalletPayload = {
  merchant_key: string;
  recipient_wallet_no: string;
  amount: number;
  desc: string;
};

export type WalletToWalletBank = {
  merchant_key: string;
  bank_code: string;
  bank_account: string;
  amount: number;
  desc: string;
};

export type WalletInfoType = {
  wallet_type: string;
  wallet_id: string;
}

export const fetchWalletInfo = async (reqData: WalletInfoType) => {
  try {
    const { data } = await axiosInstance.post(`${url}/wallet/wallet-info`, reqData);
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching wallet info: ${error?.message}`);
  }
};

export const FidelityWalletToWallet = async (
  requestData: WalletToWalletPayload
) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/wallet/fidelity-wallet-to-wallet-transfer`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching funds: ${error?.message}`);
  }
};

export const FidelityTransferFunds = async (
  requestData: WalletToWalletBank
) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/wallet/fidelity-transfer-funds`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching funds: ${error?.message}`);
  }
};

export const AccessWalletToWallet = async (
  requestData: WalletToWalletPayload
) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/wallet/fidelity-wallet-to-wallet-transfer`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};

export const AccessTransferFunds = async (requestData: WalletToWalletBank) => {
  try {
    const { data } = await axiosInstance.post(
      `${url}/wallet/access-transfer-funds`,
      requestData
    );
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching transactions: ${error?.message}`);
  }
};
