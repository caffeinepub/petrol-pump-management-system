import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import BranchSelector from './BranchSelector';
import { Menu, X, Fuel, BarChart3, Users, Gift, FileText, DollarSign, Settings, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';
import { SiCaffeine } from 'react-icons/si';

export default function Layout() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3, public: false },
    { path: '/sales', label: 'Sales', icon: DollarSign, public: false },
    { path: '/inventory', label: 'Inventory', icon: Fuel, public: false },
    { path: '/employees', label: 'Employees', icon: Users, public: false },
    { path: '/performance', label: 'Performance', icon: BarChart3, public: false },
    { path: '/loyalty', label: 'Loyalty', icon: Gift, public: false },
    { path: '/reports', label: 'Reports', icon: FileText, public: false },
    { path: '/profit-loss', label: 'P&L', icon: DollarSign, public: false },
    { path: '/tax-reports', label: 'Tax Reports', icon: FileText, public: false },
    { path: '/price-management', label: 'Prices', icon: Settings, public: false },
    { path: '/branches', label: 'Branches', icon: MapPin, public: false },
    { path: '/prebooking', label: 'Prebooking', icon: Calendar, public: false },
    { path: '/locations', label: 'Locations', icon: MapPin, public: true },
    { path: '/public-prices', label: 'Fuel Prices', icon: Fuel, public: true },
  ];

  const visibleNavItems = isAuthenticated ? navItems : navItems.filter(item => item.public);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <img src="/assets/generated/fuel-pump-logo.dim_256x256.png" alt="Logo" className="h-8 w-8" />
              <span className="hidden sm:inline">FuelStation Manager</span>
            </button>
            {isAuthenticated && <BranchSelector />}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate({ to: item.path })}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
            >
              {buttonText}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-card">
            <nav className="container py-4 flex flex-col gap-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    onClick={() => {
                      navigate({ to: item.path });
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} FuelStation Manager. Built with{' '}
            <SiCaffeine className="inline h-4 w-4 text-amber-600" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
