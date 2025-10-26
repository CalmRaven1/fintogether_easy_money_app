
import React, { useState, useContext } from 'react';
import { PoolsContext } from '../contexts/PoolsContext';
import { Icon } from './shared/Icon';

interface CreatePoolModalProps {
  onClose: () => void;
}

export const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const context = useContext(PoolsContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goalAmount = parseFloat(goal);
    if (name && description && !isNaN(goalAmount) && goalAmount > 0) {
      context?.createPool(name, description, goalAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Pool</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
             <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="pool-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pool Name</label>
              <input 
                type="text" 
                id="pool-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="pool-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea 
                id="pool-description" 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
             <div>
              <label htmlFor="pool-goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Funding Goal ($)</label>
              <input 
                type="number" 
                id="pool-goal" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="1"
                placeholder="e.g., 500"
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
            >
              Create Pool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
