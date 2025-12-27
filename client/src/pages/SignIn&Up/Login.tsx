import {useState} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LoginUsers } from '../../services';

export function Login(){
    const[emailUser, setEmailUser] = useState<string>('');
    const[passwordUser, setPasswordUser] = useState<string>('');
    const navigate = useNavigate();

    // Handle para el inicio de sesión de un usuario
    const handleLoginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataUser = {
            email_user: emailUser,
            password_user: passwordUser
        }
        try {
            const result = await LoginUsers(dataUser);
            if(result.message){
                alert('Inicio de sesión exitoso');
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                navigate('/');
                window.location.reload();
            }else{
                alert(`Error: ${result.error}`);
            }
        }
        catch (error) {
            alert('Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
        }
    }
    
    return(
        <main className='w-full h-screen fixed inset-0 
        bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <form onSubmit={handleLoginUser} className='bg-white rounded-xl p-8 w-3/10 h-3/5 flex flex-col items-center 
            shadow-2xl border border-gray-300'>
                <h2 className='text-2xl tracking-normal font-bold italic'>Inicio de Sesión</h2>
                <div className="w-full h-3/10 flex flex-col items-center p-2">
                    <label className="text-md tracking-wider w-full border-b-2">Correo Electronico</label>
                    <input 
                        type="email" 
                        className="w-full h-14 border-b-2 border-r-2 p-2
                        text-md tracking-normal focus:outline-none"
                        placeholder='Ingrese su Correo'
                        value={emailUser}
                        onChange={(e) => setEmailUser(e.target.value)}
                    />
                </div>
                <div className="w-full h-3/10  flex flex-col items-center p-2">
                    <label className="text-md tracking-wider w-full border-b-2">Contraseña</label>
                    <input 
                        type="password"
                        className="w-full h-14 border-b-2 border-r-2 p-2
                        text-md tracking-normal focus:outline-none"
                        placeholder='Ingrese su Contraseña'
                        value={passwordUser}
                        onChange={(e) => setPasswordUser(e.target.value)}
                    />
                </div>
                <div className="w-full h-3/10 flex flex-col items-center justify-evenly p-2">
                    <Link to={'/register'} className="text-sm text-blue-600 hover:underline">
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                    <button className="bg-blue-600 text-white w-3/5 h-14 cursor-pointer
                    py-3 rounded-lg font-semibold hover:bg-blue-700 hover:scale-95 transition">
                        Iniciar Sesión
                    </button>
                </div>
            </form>
        </main>
    )
}