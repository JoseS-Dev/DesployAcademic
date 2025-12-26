import {useState} from 'react';
import { LIST_CONSTANTS } from '../../utils/constants/constant.utils';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function Register(){
    const[nameUser, setNameUser] = useState<string>('');
    const[emailUser, setEmailUser] = useState<string>('');
    const[passwordUser, setPasswordUser] = useState<string>('');
    const[userName, setUserName] = useState<string>('');
    const[planUser, setPlanUser] = useState<string>('free');
    const[roleUser, setRoleUser] = useState<string>('student');
    const serviceUser = LIST_CONSTANTS.SERVICES.users;
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
            rol_user: roleUser
        }
        try {
            const result = await serviceUser.registerUser(DataUser);
            if(result.success){
                alert('Usuario registrado con éxito');
                navigate('/login');
            }
        }
        catch(error){
            alert('Error al registrar el usuario');
        }
    }

    return(
        <main className='w-full h-screen flex flex-col items-center justify-center'>
            
        </main>
    )
}