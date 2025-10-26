
import React, { useState, useContext, useCallback } from 'react';
import { PoolsContext } from '../contexts/PoolsContext';
import { Icon } from './shared/Icon';
import { analyzeWithdrawalReason } from '../services/geminiService';

interface WithdrawalModalProps {
  poolId: string;
  maxAmount: number;
  onClose: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ poolId, maxAmount, onClose }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const context = useContext(PoolsContext);

  const handleAnalyze = useCallback(async () => {
    if (!reason) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeWithdrawalReason(reason);
      setReason(analysis.summary || reason);
      setCategory(analysis.category || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [reason]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawalAmount = parseFloat(amount);
    if (!isNaN(withdrawalAmount) && withdrawalAmount > 0 && withdrawalAmount <= maxAmount && reason) {
      context?.createWithdrawalProposal(poolId, withdrawalAmount, reason, category || 'Miscellaneous');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Propose Withdrawal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
             <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="withdrawal-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
              <input 
                type="number" 
                id="withdrawal-amount" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="1"
                max={maxAmount}
                placeholder={`e.g., 50 (Max: $${maxAmount})`}
              />
            </div>
            <div>
              <label htmlFor="withdrawal-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Withdrawal</label>
              <textarea 
                id="withdrawal-reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                placeholder="Describe the purpose of this expense in detail..."
              />
               <button 
                type="button" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !reason}
                className="mt-2 flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" className="w-5 h-5 mr-2"/>
                    Analyze with AI
                  </>
                )}
              </button>
            </div>
             {category && (
               <div>
                  <label htmlFor="withdrawal-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Suggested Category</label>
                  <input
                    type="text"
                    id="withdrawal-category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded-md shadow-sm"
                  />
               </div>
             )}
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
