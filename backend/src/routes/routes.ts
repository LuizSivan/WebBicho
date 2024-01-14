import { Router } from 'express';
import { checkJwt } from '../auth/check-jwt';
import UserController from '../controllers/UserController';
import authRoutes from './auth-routes';

const routes: Router = Router();
routes.use('/auth', authRoutes);

routes.use(checkJwt);
routes
		.get('/user', UserController.get)
		.get('/user/:id', UserController.getById)
		.post('/user', UserController.create)
		.put('/user', UserController.update)
		.delete('/user/:id', UserController.delete);


export default routes;
