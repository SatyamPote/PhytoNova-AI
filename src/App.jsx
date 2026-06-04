import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes';

/** Scrolls to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/** Strip auth hash fragments from URL after OAuth redirect */
function CleanUrlHash() {
  useEffect(() => {
    if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error'))) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CleanUrlHash />
            <ScrollToTop />
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;