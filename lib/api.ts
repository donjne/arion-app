import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface CreateIntentRequest {
  amount: string;
  protocol: string;
  source_address: string;
  return_address: string;
}

export interface CreateIntentResponse {
  intent_id: string;
  position_id: string;
  status: string;
  message: string;
  near_deposit_address: string | null;
  instructions: string;
}

export interface IntentStatus {
  intent_id: string;
  position_id: string;
  status: string;
  message?: string;
  deposit_address?: string;
  amount?: string;
  instructions?: string;
  next_steps?: string[];
  amount_deposited?: string;
  created_at?: string;
  view_position?: string;
  withdraw?: string;
  eth_received?: string;
  note?: string;
}

export interface Position {
  id: string;
  intent_id: string;
  position_id_hash: string;
  amount_deposited: string;
  protocol: string;
  status: string;
  created_at: string;
  withdrawal_tx_hash: string | null;
  withdrawal_near_address: string | null;
}

export interface WithdrawRequest {
  return_address: string;
}

export interface WithdrawResponse {
  status: string;
  message: string;
  eth_sent: string;
  expected_zec: string;
  eth_transaction: string;
  near_deposit_address: string;
  recipient_zec_address: string;
  instructions: string[];
}

export interface TokenPrice {
  identifier: string;
  price_usd: string;
  timestamp: number;
}

// API Functions
export const createIntent = async (data: CreateIntentRequest): Promise<CreateIntentResponse> => {
  const response = await api.post<CreateIntentResponse>('/intent/create', data);
  return response.data;
};

export const getIntentStatus = async (intentId: string): Promise<IntentStatus> => {
  const response = await api.get<IntentStatus>(`/intent/${intentId}/status`);
  return response.data;
};

export const listIntents = async (): Promise<any[]> => {
  const response = await api.get('/intents');
  return response.data;
};

export const listPositions = async (): Promise<Position[]> => {
  const response = await api.get<Position[]>('/positions');
  return response.data;
};

export const withdrawPosition = async (
  positionId: string,
  data: WithdrawRequest
): Promise<WithdrawResponse> => {
  const response = await api.post<WithdrawResponse>(`/position/${positionId}/withdraw`, data);
  return response.data;
};

export const getTokenPrices = async (): Promise<TokenPrice[]> => {
  const response = await api.post<TokenPrice[]>('/swapkit/price', {
    tokens: [
      { identifier: 'ZEC' },
      { identifier: 'BASE.ETH' }
    ],
    metadata: true
  });
  return response.data;
};

// Error handler
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    return axiosError.response?.data?.error || 
           axiosError.response?.data?.message || 
           axiosError.message || 
           'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};