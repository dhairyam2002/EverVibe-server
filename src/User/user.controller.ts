
import { Request, Response, NextFunction } from "express";
import { UserDto } from "./user.dto";
import { validate, validateOrReject } from "class-validator";
import { User } from "../entities/User";
import AppDataSource from "../dbConfig";
import { TypeORMError, UsingJoinColumnIsNotAllowedError } from "typeorm";
interface UserObj {
    name: string;
}
class UserController {
    static registerUser = async (req: Request<{}, {}, User>, res: Response, next: NextFunction) => {
        try {

            const userRepo = AppDataSource.getRepository(User);

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



        console.log('validated');
    }
}

export default UserController;