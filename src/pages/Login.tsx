import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/Auth0Context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Login Page Component
 * Handles authentication using Auth0
 */
const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleSignup = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        },
        appState: { returnTo: window.location.pathname }
      });
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {t('auth.welcome', 'Welcome to WRLDS')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('auth.subtitle', 'Your global shopping assistant')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {t('auth.error', 'Authentication error. Please try again.')}
            </div>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full h-12 text-base font-semibold"
            size="lg"
            disabled={isLoading}
          >
            <LogIn className="mr-2 h-5 w-5" />
            {t('auth.login', 'Log In')}
          </Button>

          {/* Sign Up Button */}
          <Button
            onClick={handleSignup}
            variant="outline"
            className="w-full h-12 text-base font-semibold"
            size="lg"
            disabled={isLoading}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            {t('auth.signup', 'Sign Up')}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.or', 'Or')}
              </span>
            </div>
          </div>

          {/* Continue as Guest */}
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="w-full h-12 text-base"
            size="lg"
          >
            {t('auth.guest', 'Continue as Guest')}
          </Button>

          {/* Benefits List */}
          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">
              {t('auth.benefits.title', 'Member Benefits:')}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>{t('auth.benefits.tracking', 'Order tracking and history')}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>{t('auth.benefits.wishlist', 'Save items to wishlist')}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>{t('auth.benefits.checkout', 'Faster checkout')}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>{t('auth.benefits.deals', 'Exclusive deals & offers')}</span>
              </li>
            </ul>
          </div>

          {/* Auth0 Attribution */}
          <p className="text-xs text-center text-muted-foreground mt-6">
            {t('auth.secure', 'Secured by Auth0 - Your data is protected')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
