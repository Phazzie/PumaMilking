export type Casino = 'FanDuel' | 'BETMGM' | 'Soaring Eagle' | 'Caesars';

export interface Withdrawal {
  id: string;
  casinoName: Casino;
  withdrawalDate: string;
  amount: number;
  received: boolean;
}

export interface AddPlayerFormData {
  name: string;
  playerIdLast4: string;
  pulseplayEmail: string;
  casino: Casino;
  isActive: boolean;
  source: string;
}

export interface Player extends AddPlayerFormData {
  id: string;
  withdrawals: Withdrawal[];
}