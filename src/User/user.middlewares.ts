import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { Response as Res } from "../interfaces/response";
import AppDataSource from "../dbConfig";
import { User } from "../entities/User";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bearer = req.headers['authorization'];
        const token = bearer?.split(' ')[1];
        if(!token){
            return res.status(401).json(new Res(false, 'Login Required', {authenticated: false}, 401))
        }
        const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'SOMETHING'
        const payload =  verify(token, secret) as {user_id: string};

        if(!payload.user_id){
            throw new Error();
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({where: {user_id: payload.user_id}, relations: ['following', 'followedBy']});
        if(!user){
            return res.status(401).json(new Res(false, 'Failed to authenticate user', {authenticated: false}, 401))
        }
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json(new Res(false, 'Session expired! Please login again!', {authenticated: false}, 401));
    }
}