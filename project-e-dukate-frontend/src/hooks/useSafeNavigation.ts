/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useNavigation } from '@/contexts/NavigationContext';

export const useSafeNavigation = () => {
  if (typeof window === 'undefined') {
    return { 
      setIsNavigating: () => {},
      isNavigating: false 
    };
  }
  
  return useNavigation();
};