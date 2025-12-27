import { Link } from 'react-router-dom';
import { useUserContext } from '../../../context/userContext';
import type { CourseData } from '../../../interfaces';
import { getAllCourses } from '../../../services';
import { useEffect, useState } from 'react';

const Courses = () => {
  const {user} = useUserContext();
  const[courses, setCourses] = useState<CourseData[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  },[]);
  
  return (
    <section id="courses" className="bg-white py-20 px-5 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Cursos Destacados</span>
          <h2 className="text-5xl font-black mt-4 mb-4 text-gray-900">Aprende con los Mejores Cursos</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Programación básica, intermedia y avanzada diseñada por expertos de la industria
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((curso) => (
            <div
              key={curso.id}
              className="border-2 border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-600 hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br from-blue-50/20 to-transparent shadow-md animate-fade-in-up"
            >
              <div
                className="h-48 bg-cover bg-center relative group"
                style={{ backgroundImage: `url(${curso.thumbnail_course})` }}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    {curso.name_category}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    {curso.level_course}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{curso.title_course}</h3>
                <p className="text-gray-600 text-sm mb-4">{curso.description_course}</p>
                <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200 text-sm text-gray-600">
                  <span>👥 {(curso.total_enrollments).toFixed(1)}k</span>
                  <span>⏱️ {curso.duration_course}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-blue-600 font-semibold">{curso.price_course} $</span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/curso/${curso.id}`}
                    className={`flex-1 py-3 rounded-lg font-semibold flex flex-col items-center justify-center 
                    transition bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg 
                    hover:scale-105`}
                  >
                    {user ? 'Ver curso' : 'Ver detalles'}
                  </Link>
                  {user?.plan_user === 'free' && (
                    <Link to='/suscripcion'
                      className="px-3 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 text-xs font-semibold"
                    >
                      Profesional
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
