import express from 'express';
import UserController from './user.controller';

const router = express.Router();

router.route('/register').post(UserController.registerUser);


export default router;