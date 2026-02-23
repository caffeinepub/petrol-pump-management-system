import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import EmployeesPage from './pages/EmployeesPage';
import PerformanceReportsPage from './pages/PerformanceReportsPage';
import LoyaltyPage from './pages/LoyaltyPage';
import ReportsPage from './pages/ReportsPage';
import ProfitLossPage from './pages/ProfitLossPage';
import TaxReportsPage from './pages/TaxReportsPage';
import PriceManagementPage from './pages/PriceManagementPage';
import BranchesPage from './pages/BranchesPage';
import LocationsPage from './pages/LocationsPage';
import PublicPricesPage from './pages/PublicPricesPage';
import PrebookingPage from './pages/PrebookingPage';
import { BranchProvider } from './contexts/BranchContext';
import { EmergencyAlertProvider } from './contexts/EmergencyAlertContext';
import EmergencyAlert from './components/EmergencyAlert';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sales',
  component: SalesPage,
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: InventoryPage,
});

const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees',
  component: EmployeesPage,
});

const performanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/performance',
  component: PerformanceReportsPage,
});

const loyaltyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/loyalty',
  component: LoyaltyPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const profitLossRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profit-loss',
  component: ProfitLossPage,
});

const taxReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tax-reports',
  component: TaxReportsPage,
});

const priceManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/price-management',
  component: PriceManagementPage,
});

const branchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/branches',
  component: BranchesPage,
});

const locationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locations',
  component: LocationsPage,
});

const publicPricesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/public-prices',
  component: PublicPricesPage,
});

const prebookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prebooking',
  component: PrebookingPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  salesRoute,
  inventoryRoute,
  employeesRoute,
  performanceRoute,
  loyaltyRoute,
  reportsRoute,
  profitLossRoute,
  taxReportsRoute,
  priceManagementRoute,
  branchesRoute,
  locationsRoute,
  publicPricesRoute,
  prebookingRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <EmergencyAlertProvider>
        <BranchProvider>
          <EmergencyAlert />
          <RouterProvider router={router} />
          <Toaster />
        </BranchProvider>
      </EmergencyAlertProvider>
    </ThemeProvider>
  );
}
