import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import App from '../App';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import Cursos from '../pages/Cursos';
import Perfil from '../pages/Perfil';
import Suscripcion from '../pages/Suscripcion';
import CursoDetalle from '../pages/CursoDetalle';
import ErrorPage from '../pages/ErrorPage';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import InstructorPanel from '../pages/InstructorPanel';
import Checkout from '../pages/Checkout';
import LandingPage from '../pages/LandingPage';

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requireSubscription = false, requireInstructor = false }) => {
  const { usuarioActual, loading, isInstructor } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!usuarioActual) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireInstructor && !isInstructor) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireSubscription && usuarioActual.plan === 'gratuito') {
    return <Navigate to="/suscripcion" state={{ from: location }} replace />;
  }

  return children;
};

// Componente para manejar el modal de login en su propia ruta
const LoginPage = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  return (
    <div className="fixed inset-0 z-50">
      <LoginModal 
        isOpen={true} 
        onClose={() => window.history.back()}
        redirectTo={from}
      />
    </div>
  );
};

// Componente para manejar el modal de registro en su propia ruta
const SignupPage = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  return (
    <div className="fixed inset-0 z-50">
      <SignupModal 
        isOpen={true} 
        onClose={() => window.history.back()}
        redirectTo={from}
      />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true, 
        element: <LandingPage /> 
      },
      {
        path: 'login', 
        element: <LoginPage />
      },
      {
        path: 'registro', 
        element: <SignupPage />
      },
      {
        path: 'dashboard', 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'cursos', 
        element: <Cursos />
      },
      {
        path: 'perfil', 
        element: (
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        )
      },
      { 
        path: 'suscripcion', 
        element: <Suscripcion />
      },
      { 
        path: 'curso/:id', 
        element: <CursoDetalle />
      },
      { 
        path: 'instructor', 
        element: (
            <InstructorPanel />
        )
      },
      { 
        path: 'checkout', 
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      },
      {
        path: '*', 
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

