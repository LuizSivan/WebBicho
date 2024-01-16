import { Router } from 'express';
import { checkIsAdmin, checkJwt } from '../auth/check-jwt';
import UserController from '../controllers/UserController';
import authRoutes from './auth-routes';
import PostController from '../controllers/PostController';
import CommentController from '../controllers/CommentController';

const routes: Router = Router();
routes.use('/auth', authRoutes);

routes.use(checkJwt);
routes
		.get('/user', UserController.get)
		.get('/user/:id', UserController.getById)
		.put('/user', UserController.update)
		.delete('/user/:id', UserController.delete);

routes
		.get('/post', PostController.get)
		.get('/post/:id', PostController.getById)
		.post('/post', PostController.create)
		.put('/post', PostController.update)
		.delete('/post/:id', PostController.delete);

routes
		.get('/comment', CommentController.get)
		.get('/comment/:id', CommentController.getById)
		.post('/comment', CommentController.create)
		.put('/comment', CommentController.update)
		.delete('/comment/:id', CommentController.delete);

routes.use(checkIsAdmin);

export default routes;
