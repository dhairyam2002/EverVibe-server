import { Any, ArrayContains, In, Repository, TypeORMError } from "typeorm";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { ErrorHandler } from "../errorHandling";
import { Response } from "../interfaces/response";

class PostService{
    async createPost(postRepo: Repository<Post>, payload: {asset_link: string, user: User}){
        try {
            const post = postRepo.create(payload);
            await postRepo.save(post);

            return new Response(true, "created!", null);
            
        } catch (error) {
            if(error instanceof TypeORMError){
                return ErrorHandler.unprocessableInput(error.message);
            }
            console.log(error);
            return ErrorHandler.internalServer();
        }
    }

    async getPost(postRepo: Repository<Post>, payload: {id: string}){
        try {
            console.log(payload.id);

            const post = await postRepo.findOne({where: {id: payload.id}, relations: ['user', 'likes']});

            return new Response(true, "", {post});
        } catch (error) {
            if(error instanceof TypeORMError){
                return ErrorHandler.unprocessableInput(error.message);
            }
            console.log(error);
            return ErrorHandler.internalServer();
        }
    }
    

    async deletePost(postRepo: Repository<Post>, payload: {id: string, user: User}){
        try {
            
            const post = await postRepo.delete({id: payload.id, user: payload.user});
            return new Response(true, '', post);

        } catch (error) {
            if(error instanceof TypeORMError){
                return ErrorHandler.unprocessableInput(error.message);
            }
            console.log(error);
            return ErrorHandler.internalServer();
        }
    }

    async feeds(postRepo: Repository<Post>, payload: {user: User}){
        try {
            const {user} = payload;

            let ids: string[] = [];

            user.following.map((item) => ids.push(item.user_id));

            let feeds = await postRepo.find({where: {user: In(ids)}, relations: {user: true}})

            return new Response(true, '', feeds);

        } catch (error) {
            if(error instanceof TypeORMError){
                return ErrorHandler.unprocessableInput(error.message);
            }
            console.log(error);
            return ErrorHandler.internalServer();
        }
    }

}

export default PostService;