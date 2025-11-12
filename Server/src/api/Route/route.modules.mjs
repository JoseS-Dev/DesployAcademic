import {Router} from 'express';
import { userRoute } from '../../modules/Auth/Users/users.route.mjs';
import { CONFIG_SERVER } from '../../../config/config.mjs';

const router = Router();

export const RoutesModules = {
    users: {
        user: router.use(`${CONFIG_SERVER.basePath}/users`, userRoute)
    }
}