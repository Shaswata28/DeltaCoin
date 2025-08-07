import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Export functions for use in non-component files
let globalShowLoading: (() => void) | null = null;
let globalHideLoading: (() => void) | null = null;

export function setGlobalLoadingFunctions(
  showLoading: () => void,
  hideLoading: () => void
) {
  globalShowLoading = showLoading;
  globalHideLoading = hideLoading;
}

export function showGlobalLoading() {
  if (globalShowLoading) {
    globalShowLoading();
  }
}

export function hideGlobalLoading() {
  if (globalHideLoading) {
    globalHideLoading();
  }
}