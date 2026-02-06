export interface FidelityData {
  total_credit: string | null;
  total_debit: string | null;
  balance: string | null;
  earnings: string | null;
  account_name: string | null;
  account_number: string | null;
  bank_name: string | null;
}

export interface AccessData {
  current_earnings: string | null;
  wallet_balance: string | null;
  wallet_id: string | null;
  wallet_name: string | null;
}

export interface State {
  fidelityData: FidelityData;
  accessData: AccessData;
  loading: boolean;
}

export interface FetchSuccessAction {
  type: "FETCH_SUCCESS";
  payload: {
    fidelityData: FidelityData;
    accessData: AccessData;
  };
}

export interface FetchErrorAction {
  type: "FETCH_ERROR";
}

export type Action = FetchSuccessAction | FetchErrorAction;