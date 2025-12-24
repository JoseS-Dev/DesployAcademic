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
    // Redirigir al login, guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireInstructor && !isInstructor) {
    // Si requiere ser instructor y no lo es, redirigir al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  if (requireSubscription && usuarioActual.plan === 'gratuito') {
    return <Navigate to="/suscripcion" state={{ from: location }} replace />;
  }

  return children;
};

// Componente de diseño común para las rutas protegidas
const ProtectedLayout = ({ children }) => {
  console.log("Contenido de children en ProtectedLayout:", children);

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

// Componente para manejar el modal de login
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

// Componente para manejar el modal de registro
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

// Componente para la página de inicio
const HomePage = () => {
  const { usuarioActual } = useAuth();
  
  // Si el usuario está autenticado, redirigir al dashboard
  if (usuarioActual) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Mostrar la página de inicio normal
  return <App />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // Ruta de inicio (pública)
      { 
        index: true, element: <HomePage />
      },
      
      // Rutas de autenticación
      {
        path: 'login', element: <LoginPage />
      },
      {
        path: 'registro', element: <SignupPage />
      },
      {
        path: 'dashboard', element: <Dashboard />
      },
      {
        path: 'cursos', element: <Cursos />
      },
      {
        path: 'perfil', element: <Perfil />
      },
      { path: 'suscripcion', element: <Suscripcion /> 

      },
      { path: 'curso/:id', element: <CursoDetalle /> },
      { 
        path: 'instructor', 
        element: (
          <ProtectedRoute requireInstructor={true}>
            <InstructorPanel />
          </ProtectedRoute>
        )
      },
      { path: 'checkout', element: <Checkout /> },
      // Ruta comodín para manejar rutas no encontradas
      {
        path: '*', element: <Navigate to="/" replace />
      }
    ]
  }
]);
