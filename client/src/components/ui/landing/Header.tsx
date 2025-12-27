import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../../context/userContext';

const Header = () => {
  const {user, handleLogoutClick} = useUserContext();
  const navigate = useNavigate();
  
  return (
    <header className="sticky w-full top-0 z-40 bg-white shadow-sm border-b border-gray-200 py-3 px-5 animate-slide-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-5 flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-11%20at%2011.50.58%20AM-HrO5G5Ny0iKvTtLFdEtq1Gk4DK5Avt.jpeg"
            alt="DesployAcademic Logo"
            className="w-12 h-12 rounded-lg object-cover shadow-md hover:shadow-lg transition"
          />
          <span className="font-bold text-lg text-gray-900 hidden md:inline">DesployAcademic</span>
        </div>

        {/* Buscador */}
        <div className="hidden md:flex items-center gap-3 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 flex-1 max-w-xs hover:border-blue-400 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="¿Qué quieres aprender?"
            className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-500"
          />
        </div>

        {/* Navegación */}
        <nav className="hidden lg:flex gap-8 text-gray-600 text-sm">
          <a href="/#courses" className="hover:text-blue-600 transition font-medium">Cursos</a>
          <a href="/#teachers" className="hover:text-blue-600 transition font-medium">Profesores</a>
          <a href="/#blog" className="hover:text-blue-600 transition font-medium">Blog</a>
          <a href="/#pricing" className="hover:text-blue-600 transition font-medium">Precios</a>
        </nav>

        {/* Botones de autenticación */}
        <div className="flex gap-3 items-center flex-shrink-0">
          {!user ? (
            <div className="flex gap-2">
              <Link to="/login" className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:border-blue-600 hover:text-blue-600 transition">
                Iniciar sesión
              </Link>
              <Link to='/register'
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Regístrate
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => navigate('/perfil')}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {user.name_user ? user.name_user.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>
              <button
                className="text-gray-700 hover:text-red-600 transition text-sm font-medium cursor-pointer"
                onClick={handleLogoutClick}
              >
                Cerrar sesión
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition cursor-pointer"
                onClick={() => navigate('/suscripcion')}
              >
                Suscripción
              </button>
              {(user.role_user === 'instructor' || user.role_user === 'admin') && (
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                  onClick={() => navigate('/instructor')}
                >
                  Panel Instructor
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

