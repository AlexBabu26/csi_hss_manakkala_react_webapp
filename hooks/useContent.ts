import { useContext } from 'react';
import { ContentContext } from '../context/ContentContext';
import type { ContentContextType } from '../types';

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};