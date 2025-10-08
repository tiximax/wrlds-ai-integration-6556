/**
 * Environment Variables Validation
 * Validates all required environment variables at startup
 * Fails fast if configuration is invalid
 */

import { z } from 'zod';
import { logger } from '@/utils/logger';

/**
 * Environment variable schema
 * Add all required env vars here with proper validation
 */
const envSchema = z.object({
  // Auth0 Configuration (Required in production)
  VITE_AUTH0_DOMAIN: z.string().url().optional().or(z.literal('')),
  VITE_AUTH0_CLIENT_ID: z.string().optional().or(z.literal('')),
  VITE_AUTH0_AUDIENCE: z.string().optional().or(z.literal('')),
  VITE_AUTH0_REDIRECT_URI: z.string().url().optional().or(z.literal('')),

  // API Configuration
  VITE_API_BASE_URL: z.string().url().optional().or(z.literal('')),
  VITE_SUBSCRIBE_API_URL: z.string().url().optional().or(z.literal('')),

  // Feature Flags
  VITE_ENABLE_PWA: z.string().optional(),
  VITE_ENABLE_DEV_SW: z.string().optional(),
  VITE_E2E: z.string().optional(),
  VITE_ENABLE_TEST_LOGS: z.string().optional(),

  // Analytics & Monitoring
  VITE_SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  VITE_SENTRY_ENVIRONMENT: z.enum(['development', 'staging', 'production']).optional(),
  VITE_GA_TRACKING_ID: z.string().optional().or(z.literal('')),

  // External Services
  VITE_STRIPE_PUBLIC_KEY: z.string().optional().or(z.literal('')),
  VITE_PAYPAL_CLIENT_ID: z.string().optional().or(z.literal('')),

  // Build/Mode (automatically provided by Vite)
  MODE: z.enum(['development', 'production', 'test', 'staging']),
  DEV: z.boolean(),
  PROD: z.boolean(),
  SSR: z.boolean(),
});

/**
 * Type of validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 * Throws error if validation fails
 */
const parseEnv = (): Env => {
  try {
    const env = envSchema.parse({
      // Auth0
      VITE_AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
      VITE_AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID,
      VITE_AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE,
      VITE_AUTH0_REDIRECT_URI: import.meta.env.VITE_AUTH0_REDIRECT_URI,

      // API
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      VITE_SUBSCRIBE_API_URL: import.meta.env.VITE_SUBSCRIBE_API_URL,

      // Feature Flags
      VITE_ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA,
      VITE_ENABLE_DEV_SW: import.meta.env.VITE_ENABLE_DEV_SW,
      VITE_E2E: import.meta.env.VITE_E2E,
      VITE_ENABLE_TEST_LOGS: import.meta.env.VITE_ENABLE_TEST_LOGS,

      // Analytics
      VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
      VITE_SENTRY_ENVIRONMENT: import.meta.env.VITE_SENTRY_ENVIRONMENT,
      VITE_GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID,

      // External Services
      VITE_STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
      VITE_PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID,

      // Vite built-in
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
      SSR: import.meta.env.SSR,
    });

    logger.debug('Environment variables validated successfully', {
      mode: env.MODE,
      dev: env.DEV,
      prod: env.PROD,
      hasAuth0: !!(env.VITE_AUTH0_DOMAIN && env.VITE_AUTH0_CLIENT_ID),
      hasSentry: !!env.VITE_SENTRY_DSN,
    });

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Environment validation failed', {
        errors: error.errors,
      });

      // Format user-friendly error message
      const errorMessages = error.errors.map((err) => {
        const path = err.path.join('.');
        return `  - ${path}: ${err.message}`;
      });

      throw new Error(
        `Invalid environment configuration:\n${errorMessages.join('\n')}\n\n` +
        'Please check your .env file and ensure all required variables are set correctly.\n' +
        'See .env.example for reference.'
      );
    }
    throw error;
  }
};

/**
 * Validated environment variables
 * Use this throughout the application instead of import.meta.env
 * 
 * @example
 * import { env } from '@/config/env';
 * 
 * if (env.VITE_AUTH0_DOMAIN) {
 *   // Auth0 is configured
 * }
 */
export const env = parseEnv();

/**
 * Helper functions to check feature flags
 */
export const isFeatureEnabled = {
  pwa: () => !!env.VITE_ENABLE_PWA || env.PROD,
  devSw: () => !!env.VITE_ENABLE_DEV_SW,
  e2e: () => !!env.VITE_E2E,
  auth0: () => !!(env.VITE_AUTH0_DOMAIN && env.VITE_AUTH0_CLIENT_ID),
  sentry: () => !!env.VITE_SENTRY_DSN && env.PROD,
  stripe: () => !!env.VITE_STRIPE_PUBLIC_KEY,
  paypal: () => !!env.VITE_PAYPAL_CLIENT_ID,
} as const;

/**
 * Get API endpoints with fallbacks
 */
export const getApiEndpoint = (endpoint: string): string => {
  const baseUrl = env.VITE_API_BASE_URL || '';
  return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
};

/**
 * Get Auth0 configuration
 * Returns null if Auth0 is not configured
 */
export const getAuth0Config = (): {
  domain: string;
  clientId: string;
  audience?: string;
  redirectUri: string;
} | null => {
  if (!isFeatureEnabled.auth0()) {
    return null;
  }

  return {
    domain: env.VITE_AUTH0_DOMAIN!,
    clientId: env.VITE_AUTH0_CLIENT_ID!,
    audience: env.VITE_AUTH0_AUDIENCE || undefined,
    redirectUri: env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
  };
};

/**
 * Environment info for debugging
 */
export const getEnvInfo = () => ({
  mode: env.MODE,
  isDev: env.DEV,
  isProd: env.PROD,
  features: {
    pwa: isFeatureEnabled.pwa(),
    devSw: isFeatureEnabled.devSw(),
    auth0: isFeatureEnabled.auth0(),
    sentry: isFeatureEnabled.sentry(),
    stripe: isFeatureEnabled.stripe(),
    paypal: isFeatureEnabled.paypal(),
  },
});
