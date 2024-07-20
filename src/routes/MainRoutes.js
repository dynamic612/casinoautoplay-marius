import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

// render - sample page
const Dice = Loadable(lazy(() => import('pages/extra-pages/dice')));
const Target = Loadable(lazy(() => import('pages/extra-pages/target')));
const Mines = Loadable(lazy(() => import('pages/extra-pages/mines')));
const Hilo = Loadable(lazy(() => import('pages/extra-pages/hilo')));
const Tower = Loadable(lazy(() => import('pages/extra-pages/tower')));
const Rain = Loadable(lazy(() => import('pages/extra-pages/rain')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'Dice',
          element: <Dice />
        },
        {
          path: 'Target',
          element: <Target />
        },
        {
          path: 'Mines',
          element: <Mines />
        },
        {
          path: 'Hilo',
          element: <Hilo />
        },
        {
          path: 'Tower',
          element: <Tower />
        },
        {
          path: 'Rain',
          element: <Rain />
        },
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;