import express from 'express';
import UserController from './user.controller';
import { authenticate } from './user.middlewares';

const router = express.Router();

router.route('/register').post(UserController.register);

router.route('/user').get(UserController.getUserByIdUserNameEmail);

router.route('/login').post(UserController.login);

router.route('/profile/update').put(authenticate, UserController.updateProfile);

router.route('/me').get(authenticate, UserController.getMe);

router.route('/user/follow').put(authenticate, UserController.followUser);
router.route('/user/unfollow').put(authenticate, UserController.unfollowUser);

router.route('/posts/user/:target_user_id').get(authenticate, UserController.getPostsByUser);

router.route('/users/:user_id').get(authenticate, UserController.getUserByUserId);

router.route('/search/usersbyname').get(authenticate, UserController.searchUser);

router.route('/search/usersbyusername').get(authenticate, UserController.searchByUserName);

export default router;