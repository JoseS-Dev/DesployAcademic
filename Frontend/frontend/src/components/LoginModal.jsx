import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose, redirectTo = '/' }) => {
  const { login, usuarioActual } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta de redirección desde las props o del estado de ubicación
  const from = redirectTo || 
              (location.state?.from?.pathname || 
               (typeof location.state?.from === 'string' ? location.state.from : '/'));
  
  // Eliminar temporalmente la lógica de redirección para depuración
  useEffect(() => {
    console.log('Estado de usuario:', usuarioActual);
    console.log('Modal abierto:', isOpen);
    console.log('Redirigir a:', from);
  }, [usuarioActual, from, isOpen]);

  useEffect(() => {
    // Reset form when modal is opened/closed
    setFormData({ email: '', password: '' });
    setErrors({});
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      console.log('Iniciando proceso de login...');
      console.log('Email:', formData.email);
      
      const result = await login(formData.email, formData.password);
      console.log('Resultado del login:', result);
      
      if (result.success) {
        console.log('Inicio de sesión exitoso, redirigiendo a:', from);
        
        // Cerrar el modal si existe la función onClose
        if (onClose) onClose();
        
        // Pequeño retraso para permitir que la interfaz se actualice
        setTimeout(() => {
          console.log('Redirigiendo a:', from);
          
          // Verificar si la ruta de origen es una ruta de autenticación
          const isAuthRoute = ['/login', '/registro', '/auth'].some(route => 
            from.startsWith(route)
          );
          
          const redirectTo = isAuthRoute ? '/' : from;
          
          // Navegar a la ruta de destino
          navigate(redirectTo, { replace: true });
          
          // Forzar recarga solo si es necesario (opcional)
          if (window.location.pathname !== redirectTo) {
            window.location.href = redirectTo;
          }
        }, 300);
        
      } else {
        // Manejar error de autenticación
        const errorMsg = result.error || 'Error al iniciar sesión. Verifica tus credenciales.';
        console.error('Error en el inicio de sesión:', errorMsg);
        
        setErrors({
          form: errorMsg
        });
      }
    } catch (err) {
      console.error('Error inesperado en handleSubmit:', err);
      
      setErrors({
        form: err.message || 'Error inesperado. Por favor, inténtalo de nuevo más tarde.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold px-6 py-6 border-b border-gray-300 text-gray-800">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errors.form && (
            <div className="bg-red-100 border border-red-500 text-red-700 text-sm p-3 rounded-lg">
              {errors.form}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-sm text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={`px-3 py-2 bg-white border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold text-sm text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`px-3 py-2 bg-white border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors`}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 pb-6 px-6">
          ¿No tienes cuenta?{' '}
          <button className="text-blue-500 font-semibold hover:text-blue-400">
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;

