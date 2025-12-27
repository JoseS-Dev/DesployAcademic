import Header from "../landing/Header"
import {useUserContext} from '../../../context/userContext'
import { createInstructor, updateInstructor, getInstructorById } from "../../../services";
import { useState, useEffect } from "react";
import type { SocialLinks, InstructorData } from "../../../interfaces";
import { API_URL } from "../../../utils/constants/constant";

export function Perfil(){
    const { user } = useUserContext();
    const[instructor, setInstructor] = useState<InstructorData | undefined>(undefined);
    const[categoryInstructor, setCategoryInstructor] = useState<string>("");
    const[descriptionInstructor, setDescriptionInstructor] = useState<string>("");
    const[websiteInstructor, setWebsiteInstructor] = useState<string>("");
    const[socialMedias, setSocialMedias] = useState<SocialLinks[]>([]);
    const[currentSocial, setCurrentSocial] = useState<SocialLinks>({plataform: "", url: ""});
    const[profileImage, setProfileImage] = useState<File | null>(null);
    // Estados para actualización
    const[updCategoryInstructor, setUpdCategoryInstructor] = useState<string>("");
    const[updDescriptionInstructor, setUpdDescriptionInstructor] = useState<string>("");
    const[updWebsiteInstructor, setUpdWebsiteInstructor] = useState<string>("");
    const[updSocialMedias, setUpdSocialMedias] = useState<SocialLinks[]>([]);
    const[currentSocialUpdate, setCurrentSocialUpdate] = useState<SocialLinks>({plataform: "", url: ""});
    const[updProfileImage, setUpdProfileImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchInstructor = async () => {
            try{
                const result = await getInstructorById(user.id);
                setInstructor(result.instructor);
            }
            catch(error){
                console.error('Error fetching instructor:', error);
            }
        }
        fetchInstructor();
    }, [user]);

    // Handlers y funciones para manejar formularios, subir imagenes, agregar redes sociales, etc.
    const handleAddSocialMedia = () => {
        if(currentSocial.plataform && currentSocial.url){
            setSocialMedias([...socialMedias, currentSocial]);
            setCurrentSocial({plataform: "", url: ""});
        }
    }
    const handleRemoveSocialMedia = (index: number) => {
        const updated = [...socialMedias];
        updated.splice(index, 1);
        setSocialMedias(updated);
    }

    const handleAddSocialMediaUpdate = () => {
        if(currentSocialUpdate.plataform && currentSocialUpdate.url){
            setUpdSocialMedias([...updSocialMedias, currentSocialUpdate]);
            setCurrentSocialUpdate({plataform: "", url: ""});
        }
    }
    
    const handleRemoveSocialMediaUpdate = (index: number) => {
        const updated = [...updSocialMedias];
        updated.splice(index, 1);
        setUpdSocialMedias(updated);
    }

    // Handler para actualizar un instructor
    const handleUpdateInstructor = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            if(!instructor || !instructor.id) return alert('Instructor no encontrado');
            const formData = new FormData();
            formData.append('category_instructor', updCategoryInstructor);
            formData.append('description_instructor', updDescriptionInstructor);
            formData.append('website', updWebsiteInstructor);
            formData.append('social_links', JSON.stringify(updSocialMedias));
            formData.append('profile_picture', updProfileImage || "");

            const result = await updateInstructor(instructor.id, formData);
            if(result.message){
                alert('Información actualizada correctamente');
                window.location.reload();
            } else {
                alert('Error al actualizar la información');
            }
        }
        catch(error){
            console.error('Error updating instructor:', error);
            alert('Error al actualizar la información');
        }
    }

    // Handler para crear un instructor
    const handleCreateInstructor = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const formData = new FormData();
            formData.append('user_id', String(user.id));
            formData.append('category_instructor', categoryInstructor);
            formData.append('description_instructor', descriptionInstructor);
            formData.append('website', websiteInstructor);
            formData.append('social_links', JSON.stringify(socialMedias));
            formData.append('profile_picture', profileImage || "");
            const result = await createInstructor(formData);
            if(result.message){
                alert('Instructor creado exitosamente');
                window.location.reload();
            }else{
                alert('Error al crear el instructor');
            }
        }
        catch(error){
            console.error('Error creating instructor:', error);
            alert('Error al crear el instructor');
        }
    }

    return (
        <main className="w-full h-screen flex flex-col items.center">
            <Header/>
            <section className="w-full h-full flex items-center">
                <article className="w-1/5 h-full border-r-2 border-gray-300 flex flex-col items-center gap-2.5">
                    <div className="w-full h-1/10 flex items-center justify-center p-2.5 text-center">
                        <h2 className="text-lg font-semibold tracking-normal">Información como Instructor de {user.name_user}</h2>
                    </div>
                    <div className="w-full h-9/10 p-2.5 flex flex-col items-center gap-1.5">
                        <div className="w-full h-1/6 flex flex-col items-center justify-evenly">
                            <span className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 text-center border-gray-300">Imagen de Perfil</span>
                            <img
                                alt="Profile_picture"
                                className="border-2 border-gray-400  w-16 h-16 rounded-4xl"
                                src={`${API_URL}/uploads/instructor/${instructor?.profile_picture.split('\\').pop()}`}
                            />
                        </div>
                        <div className="w-full h-1/6 flex flex-col items-center p-2">
                            <span className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Categoria de Instructor</span>
                            <div className="w-full h-18 flex items-center">
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase ml-2">{instructor?.category_instructor || 'Desarrollador Web'}</span>
                                
                            </div>
                        </div>
                        <div className="w-full h-1/6 flex flex-col items-center p-2">
                            <span className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Descripción de Instructor</span>
                            <p className="text-sm text-gray-600 mt-1 text-justify">{instructor?.description_instructor || 'Instructor con experiencia en desarrollo web y creación de contenido educativo para estudiantes de tecnología.'}</p>
                        </div>
                        <div className="w-full h-1/6 flex flex-col items-center p-2">
                            <span className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Web del Instructor</span>
                            <a href={instructor?.website || "https://instructorwebsite.com"} className="text-blue-600 mt-5 hover:underline">{instructor?.website || "https://instructorwebsite.com"}</a>
                        </div>
                        <div className="w-full h-1/6 flex flex-col items-center p-2">
                            <span className="w-full text-md tracking-normal border-b-2 rounded-3xl px-2 border-gray-300">Redes Sociales del Instructor</span>
                            <div className="flex gap-4 mt-5">
                                {instructor?.social_links && instructor?.social_links.length > 0 ? (
                                    instructor.social_links.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {social.plataform}
                                        </a>
                                    ))
                                ) : (
                                    <span className="text-gray-500">No social links available</span>
                                )}
                            </div>
                        </div>
                        <div className="w-full h-1/6 flex flex-col items-center justify-center p-2">
                            <span className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Total de Seguidores</span>
                            <strong className="text-md text-blue-600 mt-4">1.2K estudiantes</strong>
                        </div>
                    </div>
                </article>
                <article className="w-4/5 h-full flex flex-col items-center">
                    <div className="w-full h-1/2 flex flex-col items-center p-3.5 border-b-2 border-gray-300 gap-2.5">
                        <h2 className="w-full text-lg tracking-normal border-b-2 px-2 border-gray-300">Registrar la información del Instructor</h2>
                        <form onSubmit={handleCreateInstructor} className="w-full h-11/12 flex items-center">
                            <div className="w-1/4 h-full flex flex-col items-center">
                                <div className="w-full h-2/5 flex flex-col items-center p-2.5">
                                    <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Categoria de Instructor</label>
                                    <input
                                        type="text"
                                        className="mt-2 border-2 border-gray-300 rounded-lg px-2 py-1 h-16 outline-none w-full"
                                        placeholder="Ejemplo: Desarrollador Web"
                                        value={categoryInstructor}
                                        onChange={(e) => setCategoryInstructor(e.target.value)}
                                    />
                                </div>
                                <div className="w-full h-3/5 flex flex-col items-center p-2.5">
                                    <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Descripción de Instructor</label>
                                    <textarea
                                        className="mt-2 border-2 border-gray-300 rounded-lg px-2 py-1 h-32 outline-none w-full resize-none"
                                        placeholder="Escribe una breve descripción sobre ti como instructor..."
                                        value={descriptionInstructor}
                                        onChange={(e) => setDescriptionInstructor(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="w-1/2 h-full flex border-l-2 border-gray-300 flex-col items-center">
                                <div className="w-full h-2/5 flex flex-col items-center p-2.5">
                                    <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Web del Instructor</label>
                                    <input
                                        type="text"
                                        className="mt-2 border-2 border-gray-300 rounded-lg px-2 py-1 h-16 outline-none w-full"
                                        placeholder="https://tusitio.com"
                                        value={websiteInstructor}
                                        onChange={(e) => setWebsiteInstructor(e.target.value)}
                                    />
                                </div>
                                <div className="w-full h-3/5 flex flex-col items-center p-2.5">
                                        <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Redes Sociales del Instructor</label>
                                        <div className="flex gap-2 w-full mt-2">
                                            <select
                                                value={currentSocial.plataform}
                                                className="border-2 border-gray-300 rounded-lg px-2 py-1 h-10 outline-none flex-1"
                                                onChange={(e) => setCurrentSocial({...currentSocial, plataform: e.target.value})}
                                            >
                                                <option value="">Plataforma</option>
                                                <option value="twitter">Twitter</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="facebook">Facebook</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="youtube">YouTube</option>
                                                <option value="tiktok">TikTok</option>
                                                <option value="github">GitHub</option>
                                                <option value="website">Sitio Web</option>
                                            </select>
                                            <input
                                                type="text"
                                                className="border-2 border-gray-300 rounded-lg px-2 py-1 h-10 outline-none flex-2"
                                                placeholder="URL"
                                                value={currentSocial.url}
                                                onChange={(e) => setCurrentSocial({...currentSocial, url: e.target.value})}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddSocialMedia}
                                                className="bg-blue-500 text-white px-4 py-1 rounded-lg h-10"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                        <div className="w-full mt-2 space-y-2">
                                            {socialMedias.map((social, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded-lg">
                                                    <span className="text-sm">{social.plataform}: {social.url}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSocialMedia(index)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <input
                                            type="hidden"
                                            name="social_medias"
                                            value={""}
                                        />
                                </div>
                            </div>
                            <div className="w-1/4 h-full flex border-l-2 border-gray-300 flex-col items-center">
                                <div className="w-full h-full flex flex-col items-center p-2.5">
                                    <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Imagen de Perfil</label>
                                    <div className="w-full h-3/5 flex flex-col items-center justify-center mt-2 border-2 border-dashed border-gray-300 rounded-lg">
                                        <input id="profile-image-upload" type="file" 
                                            className="hidden"
                                            onChange={(e) => {
                                                if(e.target.files && e.target.files[0]){
                                                    setProfileImage(e.target.files[0]);
                                                }
                                            }}
                                        />
                                        <label htmlFor="profile-image-upload" className="w-4/5 flex justify-center 
                                        items-center mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                                            Seleccionar imagen
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-4 bg-green-500 text-white w-3/4 
                                        h-12 px-6 py-2 rounded-lg hover:bg-green-600"
                                    >
                                        Guardar Información
                                    </button>  
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="w-full h-1/2 flex flex-col items-center p-3.5">
                        <h2 className="w-full text-lg tracking-normal border-b-2 px-2 border-gray-300">Actualizar Información de Instructor</h2>
                        <form onSubmit={handleUpdateInstructor} className="w-full h-11/12 flex items-center">
                            <div className="w-1/4 h-full flex flex-col items-center">
                                <div className="w-full h-2/5 flex flex-col items-center p-2.5">
                                    <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Categoria de Instructor</label>
                                    <input
                                        type="text"
                                        className="mt-2 border-2 border-gray-300 rounded-lg px-2 py-1 h-16 outline-none w-full"
                                        placeholder="Ejemplo: Desarrollador Web"
                                        value={updCategoryInstructor}
                                        onChange={(e) => setUpdCategoryInstructor(e.target.value)}
                                    />
                                </div>
                                <div className="w-full h-3/5 flex flex-col items-center p-2.5">
                                    <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Descripción de Instructor</label>
                                    <textarea
                                        className="mt-2 border-2 border-gray-300 rounded-lg px-2 py-1 h-32 outline-none w-full resize-none"
                                        placeholder="Escribe una breve descripción sobre ti como instructor..."
                                        value={updDescriptionInstructor}
                                        onChange={(e) => setUpdDescriptionInstructor(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="w-1/2 h-full flex border-l-2 border-gray-300 flex-col items-center">
                                <div className="w-full h-2/5 flex flex-col items-center p-2.5">
                                    <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Web del Instructor</label>
                                    <input
                                        type="text"
                                        className="mt-2 border-2 border-gray-300 rounded-lg px-2 py-1 h-16 outline-none w-full"
                                        placeholder="https://tusitio.com"
                                        value={updWebsiteInstructor}
                                        onChange={(e) => setUpdWebsiteInstructor(e.target.value)}
                                    />
                                </div>
                                <div className="w-full h-3/5 flex flex-col items-center p-2.5">
                                        <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Redes Sociales del Instructor</label>
                                        <div className="flex gap-2 w-full mt-2">
                                            <select
                                                className="border-2 border-gray-300 rounded-lg px-2 py-1 h-10 outline-none flex-1"
                                                value={currentSocialUpdate.plataform}
                                                onChange={(e) => setCurrentSocialUpdate({...currentSocialUpdate, plataform: e.target.value})}
                                            >
                                                <option value="">Plataforma</option>
                                                <option value="twitter">Twitter</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="facebook">Facebook</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="youtube">YouTube</option>
                                                <option value="tiktok">TikTok</option>
                                                <option value="github">GitHub</option>
                                                <option value="website">Sitio Web</option>
                                            </select>
                                            <input
                                                type="text"
                                                className="border-2 border-gray-300 rounded-lg px-2 py-1 h-10 outline-none flex-2"
                                                placeholder="URL"
                                                value={currentSocialUpdate.url}
                                                onChange={(e) => setCurrentSocialUpdate({...currentSocialUpdate, url: e.target.value})}
                                            />
                                            <button
                                                type="button"
                                                className="bg-blue-500 text-white px-4 py-1 rounded-lg h-10"
                                                onClick={handleAddSocialMediaUpdate}
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                        <div className="w-full mt-2 space-y-2">
                                            {updSocialMedias && updSocialMedias.length > 0 ? (
                                                updSocialMedias.map((social, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded-lg">
                                                        <span className="text-sm">{social.plataform}: {social.url}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSocialMediaUpdate(idx)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-500">No social links available</div>
                                            )}
                                        </div>
                                        <input
                                            type="hidden"
                                            name="social_medias"
                                            value={JSON.stringify(updSocialMedias)}
                                        />
                                </div>
                            </div>
                            <div className="w-1/4 h-full flex border-l-2 border-gray-300 flex-col items-center">
                                <div className="w-full h-full flex flex-col items-center p-2.5">
                                    <label className="w-full text-md tracking-normal rounded-3xl px-2 border-b-2 border-gray-300">Imagen de Perfil</label>
                                    <div className="w-full h-3/5 flex flex-col items-center justify-center mt-2 border-2 border-dashed border-gray-300 rounded-lg">
                                        <input id="profile-image-upload-update" type="file" className="hidden"
                                            onChange={(e) => {
                                                if(e.target.files && e.target.files[0]){
                                                    setUpdProfileImage(e.target.files[0]);
                                                }
                                            }}
                                        />
                                        <label htmlFor="profile-image-upload-update" className="w-4/5 flex justify-center 
                                        items-center mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                                            Seleccionar imagen
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-4 bg-green-500 text-white w-3/4 
                                        h-12 px-6 py-2 rounded-lg hover:bg-green-600"
                                    >
                                        Actualizar Información
                                    </button>  
                                </div>
                            </div>
                        </form>
                    </div>
                </article>
            </section>
        </main>
    )
}