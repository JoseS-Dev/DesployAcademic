import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rutas que requieren autenticación y/o suscripción
 * @param {Object} props - Propiedades del componente
 * @param {boolean} [props.requireSubscription=false] - Si se requiere suscripción para acceder a la ruta
 * @param {string} [props.redirectTo='/login'] - Ruta a la que redirigir si no está autenticado
 * @returns {JSX.Element} El componente protegido o una redirección
 */
const ProtectedRoute = ({ 
  requireSubscription = false, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isSubscribed, loading } = useAuth();
  const location = useLocation();

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si la ruta requiere suscripción y el usuario no está suscrito, redirigir a la página de suscripción
  if (requireSubscription && !isSubscribed) {
    return (
      <Navigate 
        to="/suscripcion" 
        state={{ 
          from: location,
          message: 'Necesitas una suscripción para acceder a este contenido.'
        }} 
        replace 
      />
    );
  }

  // Si el usuario está autenticado (y suscrito si es requerido), mostrar el contenido
  return <Outlet />;
};

export default ProtectedRoute;
