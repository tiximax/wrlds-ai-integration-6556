/**
 * Service Worker Registration Utility
 * Handles SW registration logic with proper error handling and logging
 */

import { logger } from './logger';

type ServiceWorkerType = 'dev' | 'production' | 'none';

/**
 * Determines which Service Worker to use based on environment
 * Priority: VITE_ENABLE_DEV_SW > PROD/VITE_ENABLE_PWA > none
 */
const getServiceWorkerConfig = (): { type: ServiceWorkerType; url: string | null } => {
  // Dev SW explicitly enabled (for both dev and preview modes)
  if (import.meta.env.VITE_ENABLE_DEV_SW) {
    return { type: 'dev', url: '/dev-sw.js' };
  }

  // Production or PWA mode
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_PWA) {
    return { type: 'production', url: '/sw.js' };
  }

  // No Service Worker
  return { type: 'none', url: null };
};

/**
 * Check if Service Worker API is available
 */
const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

/**
 * Register Service Worker with proper error handling
 * 
 * @returns Promise<boolean> - true if registration successful, false otherwise
 */
export const registerServiceWorker = async (): Promise<boolean> => {
  // Check browser support
  if (!isServiceWorkerSupported()) {
    logger.debug('Service Worker not supported in this browser');
    return false;
  }

  const config = getServiceWorkerConfig();

  // No SW to register
  if (config.type === 'none' || !config.url) {
    logger.debug('Service Worker registration skipped (not configured)');
    return false;
  }

  try {
    logger.debug(`Attempting to register Service Worker: ${config.url}`, {
      type: config.type,
      mode: import.meta.env.MODE,
    });

    const registration = await navigator.serviceWorker.register(config.url, {
      scope: '/',
    });

    logger.info('Service Worker registered successfully', {
      type: config.type,
      url: config.url,
      scope: registration.scope,
      state: registration.active?.state,
    });

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        logger.info('Service Worker update found', {
          state: newWorker.state,
        });

        newWorker.addEventListener('statechange', () => {
          logger.debug('Service Worker state changed', {
            state: newWorker.state,
          });

          // Notify user when new version is available
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            logger.info('New version available! Reload to update.');
            // Could trigger a UI notification here
          }
        });
      }
    });

    return true;
  } catch (error) {
    logger.error('Service Worker registration failed', {
      error,
      url: config.url,
      type: config.type,
    });
    return false;
  }
};

/**
 * Unregister all Service Workers (useful for debugging)
 */
export const unregisterServiceWorker = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    await Promise.all(
      registrations.map(async (registration) => {
        const success = await registration.unregister();
        logger.debug('Service Worker unregistered', {
          scope: registration.scope,
          success,
        });
      })
    );

    logger.info('All Service Workers unregistered');
  } catch (error) {
    logger.error('Failed to unregister Service Workers', { error });
  }
};

/**
 * Get current Service Worker registration info
 */
export const getServiceWorkerInfo = async (): Promise<{
  registered: boolean;
  controller: ServiceWorker | null;
  registrations: number;
} | null> => {
  if (!isServiceWorkerSupported()) {
    return null;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const controller = navigator.serviceWorker.controller;

    return {
      registered: registrations.length > 0,
      controller,
      registrations: registrations.length,
    };
  } catch (error) {
    logger.error('Failed to get Service Worker info', { error });
    return null;
  }
};

/**
 * Skip waiting for Service Worker update
 * Forces immediate activation of new Service Worker
 */
export const skipWaitingAndReload = (): void => {
  if (!navigator.serviceWorker.controller) {
    return;
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    logger.info('Service Worker controller changed, reloading...');
    window.location.reload();
  });

  // Send skip waiting message to SW
  navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
};
