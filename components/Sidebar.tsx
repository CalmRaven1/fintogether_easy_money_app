
import React from 'react';
import { Icon } from './shared/Icon';

interface SidebarProps {
  onNavigate: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          <Icon path="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" className="w-8 h-8 mr-2" />
          <span>CommunityPool</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-4">
          <button
            onClick={onNavigate}
            className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            <Icon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            <span className="ml-3">Dashboard</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
