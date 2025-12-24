import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

  // Verificar si hay un usuario en localStorage al cargar la aplicación
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      console.log('Datos de usuario en localStorage:', userData);
      
      if (userData) {
        const user = JSON.parse(userData);
        // Verificar si el token ha expirado (simulación)
        if (user.expiresAt && new Date(user.expiresAt) > new Date()) {
          console.log('Usuario autenticado encontrado:', user);
          setUsuarioActual(user);
        } else {
          console.log('Sesión expirada, cerrando sesión...');
          // Si el token expiró, cerrar sesión
          localStorage.removeItem('user');
        }
      } else {
        console.log('No se encontró usuario en localStorage');
      }
    } catch (error) {
      console.error('Error al cargar el usuario desde localStorage:', error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
    
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
      
      // Obtener usuarios registrados (o array vacío si no hay ninguno)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Usuarios registrados:', users);
      
      // Buscar usuario por email y contraseña
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        const errorMsg = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Crear datos de sesión
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días
      
      const userData = {
        ...user,
        token,
        expiresAt: expiresAt.toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      console.log('Datos de usuario para guardar:', userData);
      
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Forzar la actualización del estado
      setUsuarioActual({...userData});
      
      // Disparar evento personalizado para notificar a otros componentes
      window.dispatchEvent(new Event('userLoggedIn'));
      
      console.log('Inicio de sesión exitoso, usuario guardado en localStorage');
      
      return { 
        success: true,
        user: userData
      };
      
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
      
      // Verificar si el usuario ya existe
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some(u => u.email === email);
      
      if (userExists) {
        throw new Error('Ya existe un usuario con este correo electrónico');
      }
      
      // Crear nuevo usuario
      const newUser = {
        id: uuidv4(),
        nombre,
        email,
        password, // En una aplicación real, la contraseña debería estar hasheada
        plan,
        createdAt: new Date().toISOString()
      };
      
      // Guardar usuario
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Iniciar sesión automáticamente
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
      const token = localStorage.getItem('token');
      if (!token) return { isValid: false };

      const response = await fetch(`${API_URL}/subscription/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Error al verificar la suscripción');
      }

      return await response.json();
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

