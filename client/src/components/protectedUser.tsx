import {Outlet} from 'react-router-dom';
import { LIST_CONSTANTS } from '../utils/constants/constant.utils';
import { NotFound } from './notFound';
import { useState, useEffect } from 'react';

export function ProtectedUser(){
    const[loading, setLoading] = useState(true);
    const[isAuth, setIsAuth] = useState(false);
    const serviceUser = LIST_CONSTANTS.SERVICES.users;

    useEffect(() => {
        async function checkAuth(){
            try{
                const auth = await serviceUser.verifyAuth();
                if(auth.isAuthenticated){
                    setIsAuth(true);
                    setLoading(false);
                }
                else{
                    setIsAuth(false);
                    setLoading(false);
                }
            }
            catch(error){
                console.error('Error verifying authentication:', error);
                setIsAuth(false);
            }

        }
        checkAuth();
    }, []);

    return (
        <>
            {!loading && isAuth ? <Outlet/> : <NotFound/>}
        </>
    )
}