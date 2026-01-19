import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cursos } from '../data';
import CourseDetail from '../components/CourseDetail';

export default function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const courseId = Number(id);

    const curso = cursos.find(c => c.id === courseId);

    if (!curso) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Curso no encontrado</h2>
                    <p className="text-gray-600 mb-6">El curso solicitado no existe en el catálogo.</p>
                    <button
                        onClick={() => navigate('/cursos')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Volver a cursos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <CourseDetail curso={curso} />
            </div>
        </div>
    );
}
