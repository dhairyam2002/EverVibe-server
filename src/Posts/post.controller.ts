import { Request, Response } from "express";
import { Repository } from "typeorm";
import AppDataSource from "../dbConfig";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { ErrorHandler } from "../errorHandling";
import { PostActions } from "./post.dto";
import PostService from "./post.service";

let postRepo: Repository<Post> = AppDataSource.getRepository(Post);
const service = new PostService();

class PostController {
    static async newPost(req: Request<{}, {}, PostActions>, res: Response) {
        try {
            console.log(req.body);
            const { asset_link } = req.body;
            const current_user = req.user!;

            if (!asset_link) {
                return res.status(422).json(ErrorHandler.unprocessableInput('Asset link required'))
            }
            const response = await service.createPost(postRepo, { asset_link, user: current_user });

            res.status(response.statusCode).json(response);

        } catch (error) {
            console.log(error);
            return res.status(500).json(ErrorHandler.internalServer());
        }
    }

    static async getPostByPostId(req: Request<{ id?: string }>, res: Response) {
        try {
            const { id } = req.params;


            if (!id) {
                return res.status(400).json(ErrorHandler.BadRequest);
            }

            const response = await service.getPost(postRepo, { id });
            return res.status(response.statusCode).json(response);
        } catch (error) {
            res.status(500).json(ErrorHandler.internalServer);
        }
    }

    static async deletePost(req: Request<{ id?: string }>, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json(ErrorHandler.BadRequest);
            }
            console.log(req.user);

            const response = await service.deletePost(postRepo, {id});
            const user = await AppDataSource.getRepository(User).findOne({where: {id: req.user!.id}});

            console.log(user);
            res.status(response.statusCode).json(response);
            
        } catch (error) {
            res.status(500).json(ErrorHandler.internalServer);
        }
    }

    


}

export default PostController;