
import React, { useState, useContext } from 'react';
import { Pool, ProposalStatus, TransactionType, User } from '../types';
import { Icon } from './shared/Icon';
import { PoolsContext } from '../contexts/PoolsContext';
import { ContributeModal } from './ContributeModal';
import { WithdrawalModal } from './WithdrawalModal';

const ProgressBar: React.FC<{ current: number, goal: number }> = ({ current, goal }) => {
    const percentage = goal > 0 ? (current / goal) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-indigo-700 dark:text-white">${current.toLocaleString()}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Goal: ${goal.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const TransactionItem: React.FC<{ transaction: Pool['transactions'][0] }> = ({ transaction }) => (
    <li className="flex justify-between items-center py-3">
        <div className="flex items-center">
            <img className="w-10 h-10 rounded-full mr-3" src={transaction.user.avatarUrl} alt={transaction.user.name} />
            <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.user.name} &bull; {transaction.date.toLocaleDateString()}</p>
            </div>
        </div>
        <span className={`font-bold ${transaction.type === TransactionType.CONTRIBUTION ? 'text-green-500' : 'text-red-500'}`}>
            {transaction.type === TransactionType.CONTRIBUTION ? '+' : '-'}${transaction.amount.toLocaleString()}
        </span>
    </li>
);

const ProposalItem: React.FC<{ proposal: Pool['withdrawalProposals'][0], poolId: string }> = ({ proposal, poolId }) => {
    const context = useContext(PoolsContext);
    const { currentUser, approveWithdrawal } = context!;
    
    const hasApproved = proposal.approvers.some(u => u.id === currentUser.id);
    const canApprove = proposal.proposer.id !== currentUser.id && proposal.status === ProposalStatus.PENDING;
    const isOwner = proposal.proposer.id === currentUser.id;

    const handleApprove = () => {
        if (canApprove && !hasApproved) {
            approveWithdrawal(poolId, proposal.id);
        }
    }

    const getStatusChip = () => {
        switch(proposal.status) {
            case ProposalStatus.APPROVED:
                return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Approved</span>
            case ProposalStatus.PENDING:
                return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending</span>
            default:
                 return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Status</span>
        }
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold">{proposal.reason}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Proposed by {proposal.proposer.name} for <span className="font-bold">${proposal.amount}</span></p>
                </div>
                {getStatusChip()}
            </div>
            <div className="flex justify-between items-end mt-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 mr-2 text-indigo-500" />
                    <span>{proposal.approvers.length} of {proposal.requiredApprovals} approvals</span>
                </div>
                {canApprove && !hasApproved && (
                    <button onClick={handleApprove} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                        Approve
                    </button>
                )}
                 {hasApproved && <p className="text-sm text-green-600 font-semibold">You approved</p>}
                 {isOwner && <p className="text-sm text-gray-500 font-semibold">Your proposal</p>}

            </div>
        </div>
    );
}

export const PoolDetails: React.FC<{ pool: Pool }> = ({ pool }) => {
    const [isContributeModalOpen, setContributeModalOpen] = useState(false);
    const [isWithdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
    const pendingProposals = pool.withdrawalProposals.filter(p => p.status === ProposalStatus.PENDING);

    return (
        <>
            <div className="space-y-8">
                {/* Header */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{pool.name}</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{pool.description}</p>
                    <div className="mt-6">
                        <ProgressBar current={pool.currentAmount} goal={pool.goal} />
                    </div>
                    <div className="mt-6 flex space-x-4">
                        <button onClick={() => setContributeModalOpen(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                            <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" className="w-5 h-5 mr-2"/>
                            Contribute
                        </button>
                        <button onClick={() => setWithdrawalModalOpen(true)} className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <Icon path="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" className="w-5 h-5 mr-2"/>
                            Propose Withdrawal
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Proposals & Transactions */}
                    <div className="lg:col-span-2 space-y-8">
                         {pendingProposals.length > 0 && (
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold mb-4">Pending Proposals</h3>
                                <div className="space-y-4">
                                    {pendingProposals.map(p => <ProposalItem key={p.id} proposal={p} poolId={pool.id} />)}
                                </div>
                            </div>
                         )}

                        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4">Transaction History</h3>
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {pool.transactions.map(t => <TransactionItem key={t.id} transaction={t} />)}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar: Members */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4">Members ({pool.members.length})</h3>
                        <ul className="space-y-4">
                            {pool.members.map(member => (
                                <li key={member.id} className="flex items-center">
                                    <img className="w-10 h-10 rounded-full mr-3" src={member.avatarUrl} alt={member.name} />
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{member.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {isContributeModalOpen && <ContributeModal poolId={pool.id} onClose={() => setContributeModalOpen(false)} />}
            {isWithdrawalModalOpen && <WithdrawalModal poolId={pool.id} maxAmount={pool.currentAmount} onClose={() => setWithdrawalModalOpen(false)} />}
        </>
    );
};
