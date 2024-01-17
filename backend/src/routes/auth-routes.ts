import AuthController from '../controllers/AuthController';
import { Router } from 'express';
import { checkJwt } from '../auth/check-jwt';

const authRoutes: Router = Router();

authRoutes
		.post('/login', AuthController.login)
		.post('/register', AuthController.register)
		.patch('/verify', AuthController.verifyAccount);

authRoutes
		.use(checkJwt)
		.get('/', AuthController.authenticateToken);

export default authRoutes;
