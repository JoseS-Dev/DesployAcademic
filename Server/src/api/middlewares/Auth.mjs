import jwt from 'jsonwebtoken';
import { CONFIG_JWT } from '../../../config/config.mjs';
// Middleware para asignar el token al usuario
export function authMiddleware(user){
    if(!user) return {error: 'Usuario no autenticado'};
    try{
        const token = jwt.sign(
            {id: user.id, email: user.email_user, username: user.username},
            CONFIG_JWT.secret,
            {expiresIn: CONFIG_JWT.expiresIn}
        )
        return token;
    }
    catch(error){
        console.error(error);
        return {error: 'Error al generar el token'};
    }
}

// Middleware para verificar si el usuario esta autenticado
export function verifyAuthMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: 'No se proporcionó un token de autenticación válido'});
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, CONFIG_JWT.secret);
        req.user = decoded;
        next();
    }
    catch(error){
        console.error(error);
        return res.status(401).json({error: 'Token de autenticación inválido o expirado'});
    }
}
