import { Router } from 'express';
import { checkJwt } from '../auth/check-jwt';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';

const routes: Router = Router();
routes
		.post('/login', AuthController.login)
		.post('/register', AuthController.register);

routes.use(checkJwt);
routes
		.get('/user', UserController.get)
		.get('/user/:id', UserController.getById);


export default routes;
