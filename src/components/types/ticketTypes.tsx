export interface CreateTicketPayload {
  merchant_key: string;
  lga: string;
  transaction_date: string;
  invoice_id: string;
  agentEmail: string;
  plateNumber: string;
  paymentPeriod: string;
  productCode: string;
  taxPayerPhone: string;
  taxPayerName: string;
  next_expiration_date: string;
  no_of_days: string;
  amount: number | string;
  wallet_type: string;
}

export interface CreateManifestPayloadType {
  merchant_key: string,
  taxpayer_name: string,
  taxpayer_phone: string,
  vehiclePlateNumber: string,
  destination: string,
  passengers: [
    {
      name: string,
      phone_number: number | null,
      next_of_kin_name: string,
      next_of_kin_phone: string
    }
  ],
  amount: number | null,
  wallet_type: string
}

export interface CreateIndividualSportPayload {
  abssin: string,
  taxpayer_name: string,
  taxpayer_phone: string,
  team_name: string,
  ticket_type: string,
  amount: string,
  wallet_type: string,
  merchant_key: string
}
export interface CreateGroupSportPayload {
  taxpayer_name: string,
  taxpayer_phone: string,
  team_name: string,
  ticket_type: string,
  amount: string,
  wallet_type: string,
  merchant_key: string
}

export interface Transaction {
  idagent_transactions: number;
  state_id: string;
  agency: string;
  agent_user: string;
  agent_code: string | null;
  trans_date: string;
  trans_ref: string;
  rev_head: string;
  rev_code: string;
  payment_ref: string;
  reference: string;
  initialize_url: string | null;
  paymentToken: string | null;
  amount: string;
  payment_period: string;
  next_date: string;
  no_of_days: string;
  trans_channel: string;
  status: string;
  trans_type: string;
  lga: string;
  createtime: string;
  vehicle_type: string | null;
  vehicle_tonnage: string | null;
  vehicle_content: string | null;
  take_off_point: string | null;
  drop_off_destination: string | null;
  taxpayer_name: string;
  taxpayer_email: string;
  taxpayer_phone: string;
  zoneLine: string | null;
  shopNumber: string | null;
  revenue_item: string;
  payment_method: string;
  plate_number: string;
  enumeration_id: string | null;
  comment: string | null;
  taxoffice: string;
}

