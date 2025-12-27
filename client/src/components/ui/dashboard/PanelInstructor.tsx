import Header from "../landing/Header";
import { useUserContext } from "../../../context/userContext";
import { Link } from "react-router-dom";
import { getCoursesByInstructor } from "../../../services";
import { useEffect, useState } from "react";
import type { CourseData } from "../../../interfaces";

export function PanelInstructor(){
    const {user} = useUserContext();
    const[courses, setCourses] = useState<CourseData[]>([]);

    useEffect(() => {
        const fetchInstructorCourses = async () => {
            try{
                const data = await getCoursesByInstructor(0);
                setCourses(data.courses);
            }
            catch(error){
                console.error('Error fetching instructor courses:', error);
            }
        }
        fetchInstructorCourses();
    }, []);
    
    return (
        <main className="w-full h-screen flex flex-col items-center">
            <Header/>
            <section className="w-full h-11/12 flex flex-col items-center">
                <article className="w-full h-16 flex items-center justify-between px-10">
                    <h2 className="text-xl tracking-normal font-bold italic">Bienvenido de vuelta instructor {user.name_user}</h2>
                    <div className="w-1/4 h-full gap-2.5 p-8 flex items-center justify-evenly">
                        <Link to="/crear-curso" className="px-4 py-2 w-1/2 bg-blue-600 flex items-center justify-center 
                        text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">Crear nuevo curso</Link>
                        <Link to="/perfil" className="px-4 py-2 w-1/2 bg-green-600 flex items-center justify-center 
                        text-white rounded-lg hover:bg-green-700 transition cursor-pointer">Ver Perfil</Link>
                    </div>
                </article>
                <article className="w-full h-full flex flex-col items-center px-5">
                    <div className="bg-white shadow rounded-lg p-6 w-full">
                        <h2 className="text-xl font-semibold mb-4">Tus Cursos</h2>
                        {courses && courses.length === 0 ? (
                            <p className="text-gray-500">No tienes cursos creados aún.</p>
                        ) : (
                            <div className="space-y-4">
                                {courses && courses.map((curso: any) => (
                                    <div
                                        key={curso.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900">{curso.titulo}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{curso.descripcion}</p>
                                                <div className="flex gap-2 mt-2">
                                                    {curso.categoria && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                                            {curso.categoria.nombre || curso.categoria}
                                                        </span>
                                                    )}
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                        {curso.nivel}
                                                    </span>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                        ${curso.precio || 0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                                                >
                                                    Contenido
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </article>
            </section>
        </main>
    )
}