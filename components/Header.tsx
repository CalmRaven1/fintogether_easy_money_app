
import React, { useContext } from 'react';
import { Icon } from './shared/Icon';
import { PoolsContext } from '../contexts/PoolsContext';

interface HeaderProps {
    onOpenCreatePool: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreatePool }) => {
  const context = useContext(PoolsContext);
  const currentUser = context?.currentUser;

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Dashboard</h1>
      <div className="flex items-center space-x-4">
         <button 
            onClick={onOpenCreatePool}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200">
            <Icon path="M12 4v16m8-8H4" className="w-5 h-5 mr-2" />
            New Pool
        </button>
        <div className="flex items-center">
          <span className="font-medium mr-3 hidden sm:inline">{currentUser?.name}</span>
          <img className="w-10 h-10 rounded-full object-cover" src={currentUser?.avatarUrl} alt="User Avatar" />
        </div>
      </div>
    </header>
  );
};
