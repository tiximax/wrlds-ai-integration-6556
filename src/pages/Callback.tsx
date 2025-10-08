import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/Auth0Context';
import { useTranslation } from 'react-i18next';

/**
 * Auth0 Callback Page
 * Handles the redirect after Auth0 authentication
 */
const Callback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Successfully authenticated, redirect to home or intended page
        const returnTo = new URLSearchParams(window.location.search).get('returnTo') || '/';
        navigate(returnTo);
      } else if (error) {
        // Authentication error, redirect to login
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, error, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="text-center max-w-md p-8">
        {/* Loading Animation */}
        <div className="mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary mx-auto"></div>
        </div>

        {/* Status Message */}
        <h2 className="text-2xl font-bold mb-2">
          {error
            ? t('auth.callback.error', 'Authentication Error')
            : t('auth.callback.processing', 'Processing Login...')
          }
        </h2>

        <p className="text-muted-foreground">
          {error
            ? t('auth.callback.errorMessage', 'Redirecting to login page...')
            : t('auth.callback.waitMessage', 'Please wait while we complete your login.')
          }
        </p>

        {/* Progress Indicator */}
        {!error && (
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Callback;
