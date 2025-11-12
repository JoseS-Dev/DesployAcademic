import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const SignupModal = ({ isOpen, onClose, redirectTo = '/', onSwitchToLogin }) => {
  const { signup, usuarioActual } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta de redirección desde las props o del estado de ubicación
  const from = redirectTo || 
              (location.state?.from?.pathname || 
               (typeof location.state?.from === 'string' ? location.state.from : '/'));
  
  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (usuarioActual) {
      navigate(from, { replace: true });
    }
  }, [usuarioActual, from, navigate]);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    plan: 'profesional',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setFormData({
        nombre: '',
        email: '',
        password: '',
        plan: 'profesional',
        confirmPassword: ''
      });
      setErrors({});
    }
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
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      const { nombre, email, password, plan } = formData;
      console.log('Intentando registrar usuario:', { nombre, email, plan });
      
      const result = await signup(nombre, email, password, plan);
      console.log('Resultado del registro:', result);
      
      if (result.success) {
        console.log('Registro exitoso, redirigiendo a:', from);
        
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
          
          // Forzar recarga solo si es necesario
          if (window.location.pathname !== redirectTo) {
            window.location.href = redirectTo;
          }
        }, 300);
        
      } else {
        console.error('Error en el registro:', result.error);
        setErrors({
          form: result.error || 'Error al registrarse. Por favor, verifica tus datos.'
        });
      }
    } catch (err) {
      console.error('Error inesperado en handleSubmit:', err);
      setErrors({
        form: 'Error inesperado. Por favor, inténtalo de nuevo más tarde.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center p-5 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md relative">
        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold px-6 py-6 border-b border-gray-700 text-white">Regístrate Aquí</h2>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errors.form && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg">
              {errors.form}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label htmlFor="nombre" className="font-semibold text-sm text-white">
              Nombre completo
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              className={`px-3 py-2 bg-gray-800 border ${
                errors.nombre ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors`}
              disabled={isSubmitting}
            />
            {errors.nombre && (
              <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-sm text-white">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={`px-3 py-2 bg-gray-800 border ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold text-sm text-white">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`px-3 py-2 bg-gray-800 border ${
                errors.password ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors`}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="font-semibold text-sm text-white">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`px-3 py-2 bg-gray-800 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors`}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="plan" className="font-semibold text-sm text-white">
              Plan
            </label>
            <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              disabled={isSubmitting}
            >
              <option value="gratuito">Gratuito - Gratis</option>
              <option value="profesional">Profesional - $9.99/mes</option>
              <option value="empresarial">Empresarial - $29.99/mes</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {formData.plan === 'gratuito' && 'Acceso a contenido básico'}
              {formData.plan === 'profesional' && 'Acceso a todo el contenido y soporte prioritario'}
              {formData.plan === 'empresarial' && 'Acceso completo para equipos y soporte 24/7'}
            </p>
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
                Creando cuenta...
              </div>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 pb-6 px-6">
          ¿Ya tienes cuenta?{' '}
          <button className="text-blue-400 font-semibold hover:text-blue-300" onClick={onSwitchToLogin}>
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;

