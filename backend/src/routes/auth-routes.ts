import AuthController from '../controllers/AuthController';
import { Router } from 'express';

const authRoutes: Router = Router();

authRoutes
		.post('/login', AuthController.login)
		.post('/register', AuthController.register)
		.patch('/verify', AuthController.verifyAccount);

export default authRoutes;
