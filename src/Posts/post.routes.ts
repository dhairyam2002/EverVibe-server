import express from 'express';
import { authenticate } from '../User/user.middlewares';
import PostController from './post.controller';
const router = express.Router();

router.route('/posts/create').post(authenticate, PostController.newPost);
router.route('/post/:id').get(authenticate, PostController.getPostByPostId).delete(authenticate, PostController.deletePost);
export default router;