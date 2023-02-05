import { Request, Response, NextFunction } from "express";
import { FollowActions, UpdateProfileAction, UserActions } from "./user.dto";
import { validate, validateOrReject, ValidationError } from "class-validator";
import { User } from "../entities/User";
import AppDataSource from "../dbConfig";
import { Repository, TypeORMError, UsingJoinColumnIsNotAllowedError } from "typeorm";
import Service from "./user.services";
import { Response as Res } from "../interfaces/response";

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
            res.status(500).json({
                success: false,
                message: error,
                data: {}
            })
        }
    }

    static async getUserByIdUserNameEmail(req: Request<{}, {}, {}, { id? : string, userName? : string, email?: string}>, res: Response){
        try {
            const payload = {
                id: req.query.id,
                userName: req.query.userName,
                email: req.query.email
            }
            const response = await service.findUserByIdUserNameOrEmail(userRepo, payload);
            res.status(response.statusCode).json(response);

        } catch (error) {
            console.log(error);
            res.status(200).json(new Res(false, 'server side error', null));
        }
    }

    static async login(req: Request<{}, {}, {id?: string}>, res: Response){
        try {
            const payload = {
                id : req.body.id
            }

            const response = await service.loginUser(userRepo, payload);

            res.status(response.statusCode).json(response);
        } catch (error) {
            console.log(error);
            res.status(200).json(new Res(false, 'server side error', null));
        }
    }

    static async getMe(req: Request, res: Response){
        try {
            res.status(200).json(new Res(true, '', {authenticated: req.user ? true : false, user: req.user}));
        } catch (error) {
            res.status(500).json(new Res(false, 'internal server error', null, 500));
        }
    }

    private static throwUnauthorized(){
        return new Res(false, 'Login required', {authenticated: false, user: null}, 401);
    }


    private static throwInternalServer(){
        return new Res(false, 'Internal Server', null, 500);
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
            res.status(500).json(UserController.throwInternalServer());
        }
    }

    // static async followUser(req: Request<{}, {}, {target_user_id?: string}>, res: Response){
    //     try {
    //         const current_user = req.user!;
    //         const {target_user_id} = req.body;
            


    //     } catch (error) {
            
    //     }
    // }

}


export default UserController;