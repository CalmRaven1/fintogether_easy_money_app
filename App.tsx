
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PoolDetails } from './components/PoolDetails';
import { usePools } from './hooks/usePools';
import { Pool } from './types';
import { CreatePoolModal } from './components/CreatePoolModal';
import { PoolsContext } from './contexts/PoolsContext';

type View = 'dashboard' | 'poolDetails';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  
  const poolsHook = usePools();

  const handleSelectPool = (poolId: string) => {
    setSelectedPoolId(poolId);
    setCurrentView('poolDetails');
  };

  const handleNavigateToDashboard = () => {
    setSelectedPoolId(null);
    setCurrentView('dashboard');
  };

  const selectedPool = useMemo(() => {
    if (!selectedPoolId) return null;
    return poolsHook.pools.find(p => p.id === selectedPoolId) || null;
  }, [selectedPoolId, poolsHook.pools]);


  return (
    <PoolsContext.Provider value={poolsHook}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Sidebar onNavigate={handleNavigateToDashboard} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onOpenCreatePool={() => setCreateModalOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              {currentView === 'dashboard' && <Dashboard onSelectPool={handleSelectPool} />}
              {currentView === 'poolDetails' && selectedPool && <PoolDetails pool={selectedPool} />}
            </div>
          </main>
        </div>
        {isCreateModalOpen && <CreatePoolModal onClose={() => setCreateModalOpen(false)} />}
      </div>
    </PoolsContext.Provider>
  );
};

export default App;
