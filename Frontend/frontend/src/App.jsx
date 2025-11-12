import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PromoBar from './components/PromoBar';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoCarousel from './components/VideoCarousel';
import MissionVision from './components/MissionVision';
import Courses from './components/Courses';
import Teachers from './components/Teachers';
import Blog from './components/Blog';
import Pricing from './components/Pricing';
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
  const isProtectedRoute = ['/dashboard', '/cursos', '/perfil', '/suscripcion', '/curso/'].some(
    route => location.pathname.startsWith(route)
  );

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  const handleSignupClick = () => {
    navigate('/registro', { state: { from: location.pathname } });
  };

  const handleLogout = () => {
    logout(navigate);
  };

  // Si es una ruta protegida, solo mostramos el Outlet
  if (isProtectedRoute) {
    return <Outlet />;
  }

  // Si es una página de autenticación, no mostrar el layout normal
  if (isAuthPage) {
    return <Outlet />;
  }

  // Si no es una ruta protegida, mostramos la página de inicio
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
        <Hero onGetStarted={handleSignupClick} />
        <VideoCarousel />
        <MissionVision />
        <Courses />
        <Teachers />
        <Blog />
        <Pricing />
      </main>

      <Footer />
      
      {/* Los modales de login y registro ahora se manejan como rutas separadas */}
    </div>
  );
}

export default App;

