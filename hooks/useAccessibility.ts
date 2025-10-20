
import { useContext } from 'react';
import { AccessibilityContext } from '../context/AccessibilityContext';
import type { AccessibilityContextType } from '../types';

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
