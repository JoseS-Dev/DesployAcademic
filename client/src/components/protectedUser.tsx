import {Outlet, useNavigate} from 'react-router-dom';
import { NotFound } from './notFound';
import { useState, useEffect } from 'react';
import { verifyAuth } from '../services';
import { useUserContext } from '../context/userContext';


export function ProtectedUser(){
    const[loading, setLoading] = useState(true);
    const[isAuth, setIsAuth] = useState(false);
    const { user } = useUserContext();
    const navigate = useNavigate();
    useEffect(() => {
        const checkAuth = async () =>{
            try{
                await verifyAuth();
                setIsAuth(true);
                
            }
            catch(error){
                setIsAuth(false);
                navigate('/login');
            }
            finally{
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    return (
        <>
            {isAuth && !loading && user.role_user === 'instructor' ? (
                <Outlet/>
            ) : (
                <NotFound/>
            )}
        </>
    )
}