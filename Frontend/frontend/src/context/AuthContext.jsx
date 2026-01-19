import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar si hay un usuario en localStorage o desde el adaptador al cargar la aplicación
  useEffect(() => {
    (async () => {
      try {
        // intentar obtener usuario desde el adaptador (localStorage o API)
        const current = await authAPI.getCurrentUser();
        console.log('Usuario obtenido desde authAPI:', current);
        if (current && current.expiresAt && new Date(current.expiresAt) > new Date()) {
          setUsuarioActual(current);
        } else if (current && !current.expiresAt) {
          setUsuarioActual(current);
        } else {
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.debug('No hay usuario desde authAPI, revisando localStorage', err);
        try {
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            if (user.expiresAt && new Date(user.expiresAt) > new Date()) setUsuarioActual(user);
            else localStorage.removeItem('user');
          }
        } catch (e) {
          console.error('Error al cargar el usuario desde localStorage:', e);
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    })();

    // Agregar listener para cambios en el almacenamiento entre pestañas
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        try {
          const user = e.newValue ? JSON.parse(e.newValue) : null;
          setUsuarioActual(user);
        } catch (error) {
          console.error('Error al procesar cambio en localStorage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Función para simular un retraso
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const login = async (email, password) => {
    try {
      setError('');
      
      // Validaciones básicas
      if (!email || !password) {
        throw new Error('Por favor ingresa tu correo y contraseña');
      }
      
      console.log('Buscando usuario con email:', email);
      // Delegar verificación al authAPI (localAdapter o remoto)
      const user = await authAPI.login(email, password);
      if (!user) throw new Error('Credenciales incorrectas');

      // Crear datos de sesión (token + expiración)
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const userData = {
        ...user,
        token,
        expiresAt: expiresAt.toISOString(),
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUsuarioActual({ ...userData });
      window.dispatchEvent(new Event('userLoggedIn'));

      return { success: true, user: userData };
      
    } catch (err) {
      console.error('Error en login:', err);
      const errorMessage = err.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const signup = async (nombre, email, password, plan = 'gratuito') => {
    try {
      setError('');
      
      // Simular tiempo de respuesta del servidor
      await delay(500);

      // Validaciones básicas
      if (!nombre || !email || !password) {
        throw new Error('Por favor completa todos los campos');
      }

      // Usar authAPI para registrar (localAdapter lo guarda)
      await authAPI.register({ nombre, email, password, plan });
      // Luego iniciar sesión
      return await login(email, password);
      
    } catch (err) {
      console.error('Error en registro:', err);
      const errorMessage = err.message || 'Error al registrarse. Por favor, inténtalo de nuevo.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = useCallback((navigate) => {
    localStorage.removeItem('user');
    setUsuarioActual(null);
    if (navigate) navigate('/');
  }, []);

  const checkSubscription = async () => {
    try {
      // En modo local, validar según el plan del usuario
      const current = usuarioActual || JSON.parse(localStorage.getItem('user') || 'null');
      if (!current) return { isValid: false };
      return { isValid: current.plan && current.plan !== 'gratuito' && current.plan !== 'gratis' };
    } catch (err) {
      console.error('Error checking subscription:', err);
      return { isValid: false };
    }
  };

  const value = {
    usuarioActual,
    login,
    signup,
    logout,
    checkSubscription,
    loading,
    error,
    isAuthenticated: !!usuarioActual,
    isSubscribed: usuarioActual?.plan && usuarioActual.plan !== 'gratuito' && usuarioActual.plan !== 'gratis',
    isInstructor: usuarioActual?.rol === 'instructor' || usuarioActual?.rol === 'admin',
    isEstudiante: usuarioActual?.rol === 'estudiante' || usuarioActual?.rol === 'cliente' || !usuarioActual?.rol
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

