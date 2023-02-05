import express from 'express';
import UserController from './user.controller';

const router = express.Router();

router.route('/register').post(UserController.register);
router.route('/user').get(UserController.getUserByIdUserNameEmail);
router.route('/login').post(UserController.login);
export default router;