
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export enum TransactionType {
  CONTRIBUTION = 'CONTRIBUTION',
  WITHDRAWAL = 'WITHDRAWAL',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  user: User;
  date: Date;
}

export enum ProposalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface WithdrawalProposal {
  id: string;
  poolId: string;
  proposer: User;
  amount: number;
  reason: string;
  status: ProposalStatus;
  approvers: User[];
  requiredApprovals: number;
  date: Date;
  category?: string;
}

export interface Pool {
  id: string;
  name: string;
  description: string;
  goal: number;
  currentAmount: number;
  members: User[];
  transactions: Transaction[];
  withdrawalProposals: WithdrawalProposal[];
}
