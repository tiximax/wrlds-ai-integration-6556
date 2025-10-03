import React, { createContext, useContext, ReactNode, useState } from 'react';

/**
 * Mock Auth0 Context for Development
 * Use this when you don't have Auth0 credentials yet
 * Simulates authentication locally without actual Auth0
 */

interface MockUser {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
  picture: string;
  updated_at: string;
}

interface Auth0ContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: MockUser | null;
  loginWithRedirect: () => Promise<void>;
  loginWithPopup: () => Promise<void>;
  logout: (options?: any) => void;
  getAccessTokenSilently: () => Promise<string>;
  error?: Error;
}

const MockAuth0Context = createContext<Auth0ContextType | undefined>(undefined);

// Mock user data for testing
const mockUser: MockUser = {
  sub: 'mock|123456789',
  name: 'Test User',
  email: 'test@wrlds.com',
  email_verified: true,
  picture: 'https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff',
  updated_at: new Date().toISOString(),
};

/**
 * Mock Auth0 Provider
 * Provides fake authentication for development
 */
export const MockAuth0Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginWithRedirect = async () => {
    console.log('🎭 MOCK LOGIN: Simulating Auth0 login...');
    setIsLoading(true);
    
    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAuthenticated(true);
    setIsLoading(false);
    
    console.log('✅ MOCK LOGIN: Success! User logged in:', mockUser.name);
  };

  const loginWithPopup = async () => {
    await loginWithRedirect();
  };

  const logout = (options?: any) => {
    console.log('🎭 MOCK LOGOUT: Logging out...');
    setIsAuthenticated(false);
    console.log('✅ MOCK LOGOUT: Success!');
    
    // Simulate redirect
    if (options?.logoutParams?.returnTo) {
      window.location.href = options.logoutParams.returnTo;
    }
  };

  const getAccessTokenSilently = async () => {
    console.log('🎭 MOCK TOKEN: Returning fake token');
    return 'mock_access_token_for_development';
  };

  const value: Auth0ContextType = {
    isAuthenticated,
    isLoading,
    user: isAuthenticated ? mockUser : null,
    loginWithRedirect,
    loginWithPopup,
    logout,
    getAccessTokenSilently,
  };

  return (
    <MockAuth0Context.Provider value={value}>
      {/* Mock Auth Banner */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-400 text-black px-4 py-2 text-center text-sm font-semibold">
          🎭 MOCK AUTH MODE - Using fake authentication (no real Auth0)
        </div>
      )}
      <div className={isAuthenticated ? 'mt-10' : ''}>
        {children}
      </div>
    </MockAuth0Context.Provider>
  );
};

/**
 * Hook to use Mock Auth0
 */
export const useMockAuth = (): Auth0ContextType => {
  const context = useContext(MockAuth0Context);
  
  if (context === undefined) {
    throw new Error('useMockAuth must be used within MockAuth0Provider');
  }
  
  return context;
};

/**
 * HOC for protected routes (mock version)
 */
export const withMockAuthenticationRequired = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    returnTo?: string;
    onRedirecting?: () => React.ReactElement;
  }
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useMockAuth();

    React.useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        console.log('🎭 MOCK AUTH: Auto-logging in for protected route...');
        loginWithRedirect();
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

export default MockAuth0Provider;
