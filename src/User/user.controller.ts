import { Request, Response, NextFunction } from "express";
import { FollowActions, UserActions } from "./user.dto";
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
}


export default UserController;