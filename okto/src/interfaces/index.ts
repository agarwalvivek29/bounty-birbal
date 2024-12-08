import { ReactNode } from "react";
import { SupportedChain, SupportedToken } from "../types";

export interface DashboardProps {
  children: ReactNode;
}
export interface Wallet {
  network_name: string;
  address: string;
}

export interface Network {
  chain_id: string;
  network_name: SupportedChain;
}

export interface Token {
  token_name: SupportedToken;
  token_address: string;
  network_name: string;
}

export interface Address {
  id: number;
  address: string;
  amount: string;
}

export interface WalletAddressData {
  address: string;
  orderId: string;
  status: string;
}
export interface OrderData {
  selectedChain: string;
  selectedToken: string;
  totalAmount: number;
  totalWallets: number;
  walletAddresses: WalletAddressData[];
  maxFees: string;
  orderDate: Date;
}

export interface HistoryProps {
  history: OrderData[];
}

export interface DispurseProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setHistory: (order: OrderData) => void;
}
