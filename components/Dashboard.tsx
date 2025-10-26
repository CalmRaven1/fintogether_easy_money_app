
import React, { useContext } from 'react';
import { Pool } from '../types';
import { PoolsContext } from '../contexts/PoolsContext';
import { Icon } from './shared/Icon';

interface DashboardProps {
  onSelectPool: (poolId: string) => void;
}

const PoolCard: React.FC<{ pool: Pool; onSelectPool: (poolId: string) => void }> = ({ pool, onSelectPool }) => {
  const progress = (pool.currentAmount / pool.goal) * 100;

  return (
    <div 
      onClick={() => onSelectPool(pool.id)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{pool.name}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 h-10 overflow-hidden">{pool.description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Current Amount</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">${pool.currentAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
             <p className="text-xs text-gray-500 dark:text-gray-400">Goal</p>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">${pool.goal.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onSelectPool }) => {
  const context = useContext(PoolsContext);

  if (!context || !context.pools) {
    return <div>Loading pools...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {context.pools.map(pool => (
          <PoolCard key={pool.id} pool={pool} onSelectPool={onSelectPool} />
        ))}
      </div>
    </div>
  );
};
