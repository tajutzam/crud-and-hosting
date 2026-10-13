import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Loading from './components/Loading';
import { PublicRoutes } from './routes/PublicRoutes';
import { UserRoutes } from './routes/UserRoutes';
import { AdminRoutes } from './routes/AdminRoutes';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-layout">
          <Suspense fallback={<Loading />}>
            <main>
              <Routes>
                <Route element={<PublicLayout />}>
                  {PublicRoutes}
                  {UserRoutes}
                </Route>
                <Route element={<AdminLayout />}>
                  {AdminRoutes}
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </Suspense>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;