import { Request, Response, NextFunction } from "express";
import { FollowActions, UserDto } from "./user.dto";
import { validate, validateOrReject } from "class-validator";
import { User } from "../entities/User";
import AppDataSource from "../dbConfig";
import { Repository, TypeORMError, UsingJoinColumnIsNotAllowedError } from "typeorm";
interface UserObj {
    name: string;
}

let userRepo: Repository<User> = AppDataSource.getRepository(User);


class UserController {
    
    static async registerUser(req: Request<{}, {}, User>, res: Response, next: NextFunction) {
        try {

            let user = userRepo.create(req.body);

            try {
                await validateOrReject(user);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error,
                    data: {}
                })
            }

            await userRepo.insert(user);
            let payload = await userRepo.findOne({where: {id: req.body.id}});

            res.json({success: true, message: "", data: {payload}});

        } catch (error) {
            if( error instanceof TypeORMError){
                return res.status(200).json({
                    success: false,
                    message: error.message,
                    data: {}
                })
            }
            return res.status(400).json({
                success: false,
                message: error,
                data: {}
            })
        }
    }

    static async followUser(req: Request<{}, {}, FollowActions>, res: Response, next: NextFunction){
        try {
            if(!req.body.current_user || !req.body.target_user) {
                return res.status(400).json({
                    success: false,
                    message: "Target user and current user required",
                    data: {}
                })
            }

            let current_user = await userRepo.findOne({where: {id: req.body.current_user}, relations: ['following']});
            let target_user = await userRepo.findOne({where: {id: req.body.target_user}, relations: ['followedBy']});
            if(!current_user || !target_user){
                return res.status(400).json({
                    success: false,
                    message: "No user found!",
                    data: {}
                })
            }

            console.log(current_user);
            current_user.following.push(target_user);
            target_user.followedBy.push(current_user);
            await userRepo.save(current_user);
            await userRepo.save(target_user);
            res.status(200).json({success: true});
        } catch (error) {
            console.log(error);
            res.json({error: error})
        }
    }

    static async getUserById(req: Request<{}, {}, FollowActions>, res: Response){
        try {
            const user = await userRepo.findOne({where: {id: req.body.current_user}, relations: ['following', 'followedBy']});

            res.json(user);
        } catch (error) {
            res.json(error);
        }
    }
}

export default UserController;