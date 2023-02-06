import { Request, Response, NextFunction } from "express";
import { FollowActions, UpdateProfileAction, UserActions } from "./user.dto";
import { validate, validateOrReject, ValidationError } from "class-validator";
import { User } from "../entities/User";
import AppDataSource from "../dbConfig";
import { Repository, TypeORMError, UsingJoinColumnIsNotAllowedError } from "typeorm";
import Service from "./user.service";
import { Response as Res } from "../interfaces/response";
import { ErrorHandler } from "../errorHandling";

let userRepo: Repository<User> = AppDataSource.getRepository(User);
const service = new Service();

class UserController {
    static async register(req: Request<{}, {}, UserActions>, res: Response, next: NextFunction) {
        try {
            let user = userRepo.create(req.body);

            try {
                await validateOrReject(user);
            } catch (error) {
                return res.status(422).json({
                    success: false,
                    message: error,
                    data: {}
                })
            }

            const response = await service.createUser(userRepo, user);
            res.status(200).json(response);

        } catch (error) {
            res.status(500).json(ErrorHandler.internalServer());
        }
    }

    static async getUserByIdUserNameEmail(req: Request<{}, {}, {}, { id? : string, userName? : string, email?: string}>, res: Response){
        try {
            const payload = {
                user_id: req.query.id,
                userName: req.query.userName,
                email: req.query.email
            }
            const response = await service.findUserByIdUserNameOrEmail(userRepo, payload);
            res.status(response.statusCode).json(response);

        } catch (error) {
            console.log(error);
            res.status(500).json(ErrorHandler.internalServer());
        }
    }

    static async login(req: Request<{}, {}, {id?: string}>, res: Response){
        try {
            const payload = {
                user_id : req.body.id
            }

            const response = await service.loginUser(userRepo, payload);

            res.status(response.statusCode).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json(ErrorHandler.internalServer());
        }
    }

    static async getMe(req: Request, res: Response){
        try {
            res.status(200).json(new Res(true, '', {authenticated: req.user ? true : false, user: req.user}));
        } catch (error) {
            res.status(500).json(ErrorHandler.internalServer());
        }
    }

    static async updateProfile(req: Request<{}, {}, UpdateProfileAction>, res: Response){
        try {
            const current_user = req.user!;
            let user = userRepo.create(current_user);

            user.name = req.body.name ? req.body.name : user.name;
            user.userName = req.body.userName ? req.body.userName : user.userName;
            user.gender = req.body.gender ? req.body.gender : user.gender;
            user.bio = req.body.bio ? req.body.bio : user.bio;
            user.profile_image = req.body.profile_image? req.body.profile_image : user.profile_image;

            user = userRepo.create(user);
            await userRepo.save(user);

            res.status(200).json(new Res(true, 'updated!', null));

        } catch (error) {
            if(error instanceof TypeORMError){
                return res.status(200).json(new Res(false, error.message, null));
            }
            console.log(error);
            res.status(500).json(ErrorHandler.internalServer());
        }
    }

    static async followUser(req: Request<{}, {}, {target_user_id?: string}>, res: Response){
        try {
            const current_user = req.user!;
            const {target_user_id} = req.body;

            if(!target_user_id){
                return res.status(422).json(ErrorHandler.unprocessableInput('Target user required'));
            }

            const response = await service.followUser(userRepo,{current_user, target_user_id});

            res.status(response.statusCode).json(response);

            

        } catch (error) {
            res.status(500).json(ErrorHandler.internalServer());
        }
    }

    static async getUserByUserId(req: Request<{user_id?: string}>, res: Response){
        try {
            const {user_id} = req.params;

            if(!user_id){
                return res.status(422).json(ErrorHandler.unprocessableInput('Params required'));
            }

            const response = await service.getUserByUserId(userRepo, {current_user: req.user!, target_user_id: user_id});

            res.status(response.statusCode).json(response);
        } catch (error) {
            res.status(500).json(ErrorHandler.internalServer());
        }
    }
    static async getPostsByUser(req: Request<{target_user_id?: string}>, res: Response){
        try {
            const {target_user_id} = req.params;

            if(!target_user_id){
                return res.status(422).json(ErrorHandler.unprocessableInput('Params required'));
            }


            const current_user = req.user!;

            const response = await service.getPosts(userRepo, {current_user, target_user_id});
            res.status(response.statusCode).json(response);


        } catch (error) {
            res.status(500).json(ErrorHandler.internalServer());
        }
    }

}


export default UserController;