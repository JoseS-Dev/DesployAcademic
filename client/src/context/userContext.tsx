import {createContext, useState, useEffect} from 'react';
import type { UserData, UserContextInterface } from '../interfaces';
import { LIST_CONSTANTS } from '../utils/constants/constant.utils';

const servicesUser = LIST_CONSTANTS.SERVICES.users

// Creo el contexto del usuario
export const UserContext = createContext<UserContextInterface | undefined>(undefined);

// Defino el proveedor del contexto del usuario
export const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<UserData | undefined>();

    // Cargo los datos del usuario al montar el componente
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // Manejo del cierre de sesión del usuario
    const handleLogoutClick = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await servicesUser.LogoutUser(user?.id!);
            if(result.success){
                alert('Cierre de sesión exitoso');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(undefined);
            }
        }
        catch (error) {
            alert('Error al cerrar sesión. Por favor, inténtelo de nuevo más tarde.');
        }
    }
    return (
        <UserContext.Provider value={{user: user!, handleLogoutClick}}>
            {children}
        </UserContext.Provider>
    )
}

