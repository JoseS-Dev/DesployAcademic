import {createContext, useState, useEffect, useContext} from 'react';
import type { UserData, UserContextInterface } from '../interfaces';
import { LogoutUser } from '../services';


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
            const result = await LogoutUser(user?.id!);
            if(result.message){
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

// Exporto para consumir el contexto del usuario
export function useUserContext() {
    const context = useContext(UserContext);
    if(!context) throw new Error('useUserContext must be used within a UserProvider');
    return context;
}

