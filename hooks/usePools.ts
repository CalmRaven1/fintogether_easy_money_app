
import { useState } from 'react';
import { Pool, User, Transaction, TransactionType, WithdrawalProposal, ProposalStatus } from '../types';

const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'You', avatarUrl: 'https://picsum.photos/seed/you/40/40' },
  { id: 'user-2', name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/alice/40/40' },
  { id: 'user-3', name: 'Bob Williams', avatarUrl: 'https://picsum.photos/seed/bob/40/40' },
  { id: 'user-4', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/charlie/40/40' },
];

const MOCK_POOLS: Pool[] = [
  {
    id: 'pool-1',
    name: 'Community Garden Supplies',
    description: 'Funds for purchasing new tools, soil, and seeds for the Spring planting season.',
    goal: 500,
    currentAmount: 275,
    members: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2]],
    transactions: [
      { id: 't-1', type: TransactionType.CONTRIBUTION, amount: 100, description: 'Initial seed funding', user: MOCK_USERS[1], date: new Date('2023-10-01') },
      { id: 't-2', type: TransactionType.CONTRIBUTION, amount: 75, description: 'Donation from bake sale', user: MOCK_USERS[2], date: new Date('2023-10-05') },
      { id: 't-3', type: TransactionType.CONTRIBUTION, amount: 100, description: 'Personal Contribution', user: MOCK_USERS[0], date: new Date('2023-10-10') },
    ],
    withdrawalProposals: [
      { id: 'wp-1', poolId: 'pool-1', proposer: MOCK_USERS[1], amount: 50, reason: 'Purchase of new shovels and gloves from Home Depot', status: ProposalStatus.PENDING, approvers: [MOCK_USERS[0]], requiredApprovals: 2, date: new Date('2023-10-12'), category: 'Supplies' }
    ]
  },
  {
    id: 'pool-2',
    name: 'Student Tech Club Hackathon',
    description: 'Budget for our annual hackathon event, covering food, prizes, and cloud server costs.',
    goal: 2000,
    currentAmount: 1250,
    members: [MOCK_USERS[0], MOCK_USERS[3]],
    transactions: [
       { id: 't-4', type: TransactionType.CONTRIBUTION, amount: 1000, description: 'University grant', user: MOCK_USERS[3], date: new Date('2023-09-15') },
       { id: 't-5', type: TransactionType.CONTRIBUTION, amount: 250, description: 'Member fees', user: MOCK_USERS[0], date: new Date('2023-09-20') },
    ],
    withdrawalProposals: []
  },
];


export const usePools = () => {
  const [pools, setPools] = useState<Pool[]>(MOCK_POOLS);
  const currentUser = MOCK_USERS[0];

  const createPool = (name: string, description: string, goal: number) => {
    const newPool: Pool = {
      id: `pool-${Date.now()}`,
      name,
      description,
      goal,
      currentAmount: 0,
      members: [currentUser],
      transactions: [],
      withdrawalProposals: [],
    };
    setPools(prev => [newPool, ...prev]);
  };

  const addContribution = (poolId: string, amount: number, description: string) => {
    setPools(prev => prev.map(pool => {
      if (pool.id === poolId) {
        const newTransaction: Transaction = {
          id: `t-${Date.now()}`,
          type: TransactionType.CONTRIBUTION,
          amount,
          description,
          user: currentUser,
          date: new Date(),
        };
        return {
          ...pool,
          currentAmount: pool.currentAmount + amount,
          transactions: [newTransaction, ...pool.transactions],
        };
      }
      return pool;
    }));
  };
  
  const createWithdrawalProposal = (poolId: string, amount: number, reason: string, category: string) => {
    setPools(prev => prev.map(pool => {
      if (pool.id === poolId && pool.currentAmount >= amount) {
        const newProposal: WithdrawalProposal = {
          id: `wp-${Date.now()}`,
          poolId,
          proposer: currentUser,
          amount,
          reason,
          category,
          status: ProposalStatus.PENDING,
          approvers: [],
          requiredApprovals: Math.min(2, pool.members.length), // Require 2 approvals or all members if less than 2
          date: new Date(),
        };
        return {
          ...pool,
          withdrawalProposals: [newProposal, ...pool.withdrawalProposals]
        }
      }
      return pool;
    }))
  };

  const approveWithdrawal = (poolId: string, proposalId: string) => {
    setPools(prev => prev.map(pool => {
      if (pool.id === poolId) {
        let proposalApproved = false;
        const updatedProposals = pool.withdrawalProposals.map(p => {
          if (p.id === proposalId && !p.approvers.find(u => u.id === currentUser.id)) {
            const newApprovers = [...p.approvers, currentUser];
            if (newApprovers.length >= p.requiredApprovals) {
              proposalApproved = true;
              return { ...p, status: ProposalStatus.APPROVED, approvers: newApprovers };
            }
            return { ...p, approvers: newApprovers };
          }
          return p;
        });

        if (proposalApproved) {
          const proposal = updatedProposals.find(p => p.id === proposalId)!;
          const newTransaction: Transaction = {
            id: `t-${Date.now()}`,
            type: TransactionType.WITHDRAWAL,
            amount: proposal.amount,
            description: proposal.reason,
            user: proposal.proposer,
            date: new Date(),
          };
          return {
            ...pool,
            currentAmount: pool.currentAmount - proposal.amount,
            transactions: [newTransaction, ...pool.transactions],
            withdrawalProposals: updatedProposals,
          };
        }
        return { ...pool, withdrawalProposals: updatedProposals };
      }
      return pool;
    }));
  };


  return { pools, currentUser, createPool, addContribution, createWithdrawalProposal, approveWithdrawal };
};
