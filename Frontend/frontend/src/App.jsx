import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PromoBar from './components/PromoBar';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const { usuarioActual, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mostrar un spinner de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAuthenticated = !!usuarioActual;
  const isAuthPage = ['/login', '/registro'].includes(location.pathname);

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleSignupClick = () => {
    navigate('/registro', { state: { from: location.pathname } });
  };

  const handleLogout = () => {
    logout(navigate);
  };

  // Si es una página de autenticación, no mostrar el layout normal (solo Outlet)
  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-white">
      <PromoBar onSignupClick={handleSignupClick} />
      <Header 
        onLoginClick={handleLoginClick} 
        onSignupClick={handleSignupClick}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      
      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
