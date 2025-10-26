
import { createContext } from 'react';
import { usePools } from '../hooks/usePools';

export const PoolsContext = createContext<ReturnType<typeof usePools> | null>(null);
