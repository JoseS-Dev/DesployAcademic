import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuarioActual, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Hola, {usuarioActual?.nombre || 'Usuario'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">Tu Plan</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {usuarioActual?.plan ? 
                  usuarioActual.plan.charAt(0).toUpperCase() + usuarioActual.plan.slice(1) : 
                  'No especificado'}
              </p>
              <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Actualizar plan
              </button>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-800">Cursos en progreso</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">3</p>
              <button className="mt-4 text-sm text-green-600 hover:text-green-800 font-medium">
                Ver mis cursos
              </button>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800">Logros</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">5/10</p>
              <button className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-medium">
                Ver logros
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contenido recomendado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Aquí irían los cursos recomendados */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium">Curso de React Avanzado</h3>
                <p className="text-sm text-gray-600 mt-1">Continúa donde lo dejaste</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">65% completado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
