import {useState} from 'react';
import { registerUser } from '../../services';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function Register(){
    const[nameUser, setNameUser] = useState<string>('');
    const[emailUser, setEmailUser] = useState<string>('');
    const[passwordUser, setPasswordUser] = useState<string>('');
    const[userName, setUserName] = useState<string>('');
    const[planUser, setPlanUser] = useState<string>('free');
    const[roleUser, setRoleUser] = useState<string>('student');
    const navigate = useNavigate();
    // Handle para la el registro del usuario a la aplicación
    const handleRegisterUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const DataUser = {
            name_user: nameUser,
            email_user: emailUser,
            password_user: passwordUser,
            username: userName,
            plan_user: planUser,
            role_user: roleUser
        }
        try {
            const result = await registerUser(DataUser);
            if(result.message){
                alert('Usuario registrado exitosamente');
                navigate('/login');
            }
        }
        catch(error){
            alert('Error al registrar el usuario');
        }
    }

    return(
        <main className='w-full h-screen fixed inset-0 
        bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <form className='bg-white rounded-xl p-8 w-2/5 h-3/4 gap-2.5 flex flex-col items-center 
            shadow-2xl border border-gray-300'>
                <h2 className='text-2xl tracking-wide font-bold'>Registro de Cuenta</h2>
                <div className='w-full h-1/4 flex items-center border-b-2 border-gray-300'>
                    <div className='w-1/2 h-full flex flex-col items-center p-3'>
                        <label className='text-lg tracking-normal w-full border-b-2'>Nombre</label>
                        <input 
                            type="text" 
                            className="w-full h-16 border-b-2 border-r-2 p-2
                            text-md tracking-normal focus:outline-none"
                            placeholder='Ingrese su Nombre'
                            value={nameUser}
                            onChange={(e) => setNameUser(e.target.value)}
                        />
                    </div>
                    <div className='w-1/2 h-full flex p-3 flex-col items-center'>
                        <label className='text-lg tracking-normal w-full border-b-2'>Username</label>
                        <input 
                            type="text" 
                            className="w-full h-16 border-b-2 border-r-2 p-2
                            text-md tracking-normal focus:outline-none"
                            placeholder='Ingrese su Username'
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                </div>
                <div className='w-full h-1/4 flex items-center border-b-2 border-gray-300'>
                    <div className='w-1/2 h-full flex flex-col p-3 items-center 
                    '>
                        <label className='text-lg tracking-normal w-full border-b-2'>Correo</label>
                        <input 
                            type="email" 
                            className="w-full h-16 border-b-2 border-r-2 p-2
                            text-md tracking-normal focus:outline-none"
                            placeholder='Ingrese su Correo'
                            value={emailUser}
                            onChange={(e) => setEmailUser(e.target.value)}
                        />
                    </div>
                    <div className='w-1/2 h-full flex flex-col p-3 items-center
                    '>
                        <label className='text-lg tracking-normal w-full border-b-2'>Contraseña</label>
                        <input 
                            type="password" 
                            className="w-full h-16 border-b-2 border-r-2 p-2
                            text-md tracking-normal focus:outline-none"
                            placeholder='Ingrese su Contraseña'
                            value={passwordUser}
                            onChange={(e) => setPasswordUser(e.target.value)}
                        />
                    </div>
                </div>
                <div className='w-full h-1/4 flex items-center border-b-2 border-gray-300'>
                    <div className='w-1/2 h-full flex flex-col p-3 items-center'>
                        <label className='text-lg tracking-normal w-full border-b-2'>Plan</label>
                        <select 
                            className="w-full h-16 border-b-2 border-r-2 p-2
                            text-md tracking-normal focus:outline-none"
                            value={planUser}
                            onChange={(e) => setPlanUser(e.target.value)}
                        >
                            <option value="free">Free</option>
                            <option value="premium">Premium</option>
                        </select>
                    </div>
                    <div className='w-1/2 h-full flex flex-col p-3 items-center'>
                        <label className='text-lg tracking-normal w-full border-b-2'>Rol</label>
                        <select 
                            className="w-full h-16 border-b-2 border-r-2 p-2
                            text-md tracking-normal focus:outline-none"
                            value={roleUser}
                            onChange={(e) => setRoleUser(e.target.value)}
                        >
                            <option value="student">estudiante</option>
                            <option value="instructor">Instructor</option>
                        </select>
                    </div>
                </div>
                <div className='w-full h-1/4 flex flex-col items-center justify-center p-2.5 gap-2.5'>
                    <Link to={'/login'} className="text-sm text-blue-600 hover:underline">
                        ¿Ya tienes una cuenta? Inicia Sesión
                    </Link>
                    <button 
                        onClick={handleRegisterUser}
                        className="bg-blue-600 text-white w-3/5 h-14 cursor-pointer
                        py-3 rounded-lg font-semibold hover:bg-blue-700 hover:scale-95 transition"
                    >
                        Registrarse
                    </button>
                </div>
            </form>
        </main>
    )
}