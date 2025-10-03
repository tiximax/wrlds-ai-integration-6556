import React, { createContext, useContext, ReactNode } from 'react';
import { Auth0Provider, useAuth0 as useAuth0Hook, Auth0ProviderOptions } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

// Auth0 Configuration from environment variables
const auth0Config: Auth0ProviderOptions = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin + '/callback',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
  // Cache settings for better performance
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true,
};

// Extended Auth Context with custom hooks
interface Auth0ContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  loginWithRedirect: () => Promise<void>;
  loginWithPopup: () => Promise<void>;
  logout: () => void;
  getAccessTokenSilently: () => Promise<string>;
  error?: Error;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

/**
 * Auth0 Provider Wrapper
 * Wraps the app with Auth0 authentication
 */
export const Auth0ProviderWithNavigate: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: any) => {
    // Navigate to the intended page or home after login
    navigate(appState?.returnTo || window.location.pathname);
  };

  // Check if Auth0 is configured
  const isConfigured = auth0Config.domain && auth0Config.clientId;

  if (!isConfigured) {
    console.warn('⚠️ Auth0 not configured. Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in .env.local');
    
    // Return a mock provider for development without Auth0
    return (
      <Auth0Context.Provider
        value={{
          isAuthenticated: false,
          isLoading: false,
          user: null,
          loginWithRedirect: async () => console.log('Auth0 not configured'),
          loginWithPopup: async () => console.log('Auth0 not configured'),
          logout: () => console.log('Auth0 not configured'),
          getAccessTokenSilently: async () => '',
          error: new Error('Auth0 not configured'),
        }}
      >
        {children}
      </Auth0Context.Provider>
    );
  }

  return (
    <Auth0Provider
      {...auth0Config}
      onRedirectCallback={onRedirectCallback}
    >
      <Auth0ContextWrapper>{children}</Auth0ContextWrapper>
    </Auth0Provider>
  );
};

/**
 * Internal wrapper to provide extended context
 */
const Auth0ContextWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth0 = useAuth0Hook();

  return (
    <Auth0Context.Provider value={auth0 as Auth0ContextType}>
      {children}
    </Auth0Context.Provider>
  );
};

/**
 * Custom hook to use Auth0 context
 * Usage: const { isAuthenticated, user, loginWithRedirect, logout } = useAuth();
 */
export const useAuth = (): Auth0ContextType => {
  const context = useContext(Auth0Context);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within Auth0ProviderWithNavigate');
  }
  
  return context;
};

/**
 * Higher-order component to require authentication
 * Usage: export default withAuthenticationRequired(MyComponent);
 */
export const withAuthenticationRequired = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    returnTo?: string;
    onRedirecting?: () => React.ReactElement;
  }
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth();

    React.useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        loginWithRedirect({
          appState: { returnTo: options?.returnTo || window.location.pathname }
        });
      }
    }, [isLoading, isAuthenticated, loginWithRedirect]);

    if (isLoading) {
      return options?.onRedirecting ? (
        options.onRedirecting()
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};

export default Auth0ProviderWithNavigate;
