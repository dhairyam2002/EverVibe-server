import express from 'express';
import UserController from './user.controller';
import { authenticate } from './user.middlewares';

const router = express.Router();

router.route('/register').post(UserController.register);
router.route('/user').get(UserController.getUserByIdUserNameEmail);
router.route('/login').post(UserController.login);

router.route('/me').get(authenticate, UserController.getMe);
export default router;