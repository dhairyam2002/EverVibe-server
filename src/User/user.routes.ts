import express from 'express';
import UserController from './user.controller';

const router = express.Router();

router.route('/register').post(UserController.registerUser);
router.route('/follow').put(UserController.getUserById);

export default router;