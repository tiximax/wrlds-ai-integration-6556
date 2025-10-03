import { useAuth, withAuthenticationRequired } from '@/contexts/Auth0Context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Shield, Calendar, LogOut, Package, Heart, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * User Profile Page
 * Displays user information and account management options
 */
const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date?: string) => {
    if (!date) return t('profile.dateUnknown', 'Unknown');
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container max-w-4xl py-8 px-4">
      {/* Header Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={user?.picture} alt={user?.name || 'User'} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {getUserInitials(user?.name)}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="text-3xl mb-2">{user?.name || t('profile.anonymous', 'Anonymous User')}</CardTitle>
              <CardDescription className="text-base mb-3 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {user?.email || t('profile.noEmail', 'No email provided')}
              </CardDescription>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {user?.email_verified && (
                  <Badge variant="default" className="gap-1">
                    <Shield className="h-3 w-3" />
                    {t('profile.verified', 'Verified')}
                  </Badge>
                )}
                <Badge variant="secondary">
                  {t('profile.member', 'Member')}
                </Badge>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('profile.logout', 'Log Out')}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Account Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('profile.accountDetails', 'Account Details')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* User ID */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {t('profile.userId', 'User ID')}
              </p>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
                {user?.sub?.slice(-12) || 'N/A'}
              </p>
            </div>

            {/* Account Created */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {t('profile.memberSince', 'Member Since')}
              </p>
              <p className="text-sm px-3 py-2">
                {formatDate(user?.updated_at)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Auth Provider */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {t('profile.loginMethod', 'Login Method')}
            </p>
            <p className="text-sm px-3 py-2">
              {user?.sub?.split('|')[0] === 'google-oauth2' ? 'Google' :
               user?.sub?.split('|')[0] === 'facebook' ? 'Facebook' :
               user?.sub?.split('|')[0] === 'auth0' ? 'Email/Password' :
               t('profile.other', 'Other')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.quickActions', 'Quick Actions')}</CardTitle>
          <CardDescription>
            {t('profile.quickActionsDesc', 'Manage your account and orders')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => navigate('/orders')}
          >
            <Package className="mr-3 h-5 w-5" />
            <div className="text-left">
              <p className="font-semibold">{t('profile.orders', 'My Orders')}</p>
              <p className="text-xs text-muted-foreground">{t('profile.ordersDesc', 'Track orders')}</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => navigate('/wishlist')}
          >
            <Heart className="mr-3 h-5 w-5" />
            <div className="text-left">
              <p className="font-semibold">{t('profile.wishlist', 'Wishlist')}</p>
              <p className="text-xs text-muted-foreground">{t('profile.wishlistDesc', 'Saved items')}</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => navigate('/addresses')}
          >
            <MapPin className="mr-3 h-5 w-5" />
            <div className="text-left">
              <p className="font-semibold">{t('profile.addresses', 'Addresses')}</p>
              <p className="text-xs text-muted-foreground">{t('profile.addressesDesc', 'Manage shipping')}</p>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <Shield className="inline-block h-4 w-4 mr-1" />
        {t('profile.securityNote', 'Your account is secured by Auth0. We never store your password.')}
      </div>
    </div>
  );
};

// Wrap with authentication requirement
export default withAuthenticationRequired(Profile, {
  onRedirecting: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    </div>
  )
});
