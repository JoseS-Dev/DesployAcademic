import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CourseDetail: Vista de detalle reutilizable para un curso.
 * Props:
 * - curso: objeto de curso (id, titulo, imagen, categoria, nivel, descripcion, estudiantes, duracion, calificacion, precio)
 * - modal: boolean opcional para renderizar como modal
 * - onClose: función opcional para cerrar cuando modal=true
 */
export default function CourseDetail({ curso, modal = false, onClose }) {
    const navigate = useNavigate();

    if (!curso) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow text-center">
                <p className="text-gray-600">No se encontró información del curso.</p>
            </div>
        );
    }

    const openCourse = () => navigate(`/curso/${curso.id}`);

    const Card = (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Imagen */}
            {curso.imagen ? (
                <div className="h-56 bg-gray-100 overflow-hidden">
                    <img src={curso.imagen} alt={curso.titulo} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="h-56 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">{curso.titulo?.charAt(0) || 'C'}</span>
                </div>
            )}

            {/* Contenido */}
            <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    {curso.categoria && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {curso.categoria.nombre || curso.categoria}
                        </span>
                    )}
                    {curso.nivel && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {curso.nivel}
                        </span>
                    )}
                </div>

                <h3 className="text-2xl font-bold mb-2 text-gray-900">{curso.titulo}</h3>
                {curso.instructor && (
                    <p className="text-sm text-gray-600 mb-1">Por {curso.instructor.nombre || curso.instructor}</p>
                )}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{curso.descripcion}</p>

                {/* Métricas */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    {curso.estudiantes != null && (
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {curso.estudiantes >= 1000 ? `${(curso.estudiantes / 1000).toFixed(1)}k` : curso.estudiantes}
                        </span>
                    )}
                    {curso.duracion && (
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {curso.duracion}
                        </span>
                    )}
                    {curso.calificacion && (
                        <span className="flex items-center">
                            <span className="text-yellow-500 mr-1">⭐</span>
                            {curso.calificacion}
                        </span>
                    )}
                    <div className="text-right">
                        {curso.precio === 0 || curso.precio === null || curso.precio === 'Incluido' ? (
                            <span className="text-green-600 font-semibold">Gratis</span>
                        ) : (
                            <span className="text-blue-600 font-semibold">{typeof curso.precio === 'number' ? `$${curso.precio}` : curso.precio}</span>
                        )}
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
                    <button
                        onClick={openCourse}
                        className="flex-1 px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                        Abrir curso
                    </button>
                    {modal && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cerrar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    if (!modal) return Card;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-2xl mx-auto">{Card}</div>
        </div>
    );
}
