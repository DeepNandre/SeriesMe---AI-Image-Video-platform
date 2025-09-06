import { useState, useEffect } from 'react';

/**
 * Custom hook to detect online/offline status
 * Listens to browser online/offline events and returns current status
 */
export function useOnline(): boolean {
  // Initialize with current online status
  const [isOnline, setIsOnline] = useState(() => {
    // Check if we're in a browser environment
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true; // Assume online during SSR
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      // Log status changes for debugging
      console.log(`🌐 Connection status: ${online ? 'online' : 'offline'}`);
    };

    // Set initial status
    updateOnlineStatus();

    // Listen to online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Cleanup listeners
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
}

/**
 * Hook that provides online status with additional utilities
 */
export function useOnlineStatus() {
  const isOnline = useOnline();

  return {
    isOnline,
    isOffline: !isOnline,
    // Helper method to check if a feature should be available offline
    isFeatureAvailable: (requiresInternet: boolean = true): boolean => {
      return requiresInternet ? isOnline : true;
    }
  };
}