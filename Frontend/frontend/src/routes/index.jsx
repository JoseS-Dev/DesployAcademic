import { createBrowserRouter, Navigate } from 'react-router-dom';
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

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requireSubscription = false }) => {
  const { usuarioActual, loading } = useAuth();
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

  if (requireSubscription && usuarioActual.plan === 'gratuito') {
    return <Navigate to="/suscripcion" state={{ from: location }} replace />;
  }

  return children;
};

// Componente de diseño común para las rutas protegidas
const ProtectedLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {children}
  </div>
);

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
        index: true, 
        element: <HomePage />
      },
      
      // Rutas de autenticación
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'registro',
        element: <SignupPage />
      },
      
      // Rutas protegidas
      {
        element: (
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'cursos',
            element: <Cursos />
          },
          {
            path: 'perfil',
            element: <Perfil />
          },
          {
            path: 'suscripcion',
            element: <Suscripcion />
          },
          {
            path: 'curso/:id',
            element: <CursoDetalle />
          }
        ]
      },
      
      // Ruta comodín para manejar rutas no encontradas
      {
        path: '*',
        element: <Navigate to="/404" replace />
      },
      // Ruta 404 personalizada
      {
        path: '/404',
        element: (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Página no encontrada</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Volver atrás
            </button>
            <a 
              href="/" 
              className="mt-4 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Ir al inicio
            </a>
          </div>
        )
      }
    ]
  }
]);
