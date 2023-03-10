import { ILike, Like, Repository, TypeORMError } from "typeorm";
import { User } from "../entities/User";
import { verify, decode, sign } from 'jsonwebtoken';
import { Response } from "../interfaces/response";
import { ErrorHandler } from "../errorHandling";
class Service {

    private async getJwtToken(user_id: string): Promise<string> {
        const token = await sign({ user_id: user_id }, process.env.JWT_SECRET ? process.env.JWT_SECRET : 'RANDOMSTRING', {
            expiresIn: '3d'
        })
        return token;
    }

    throwUnauthorized() {
        return new Response(false, 'Login required', { authenticated: false, user: null }, 401);
    }


    throwInternalServer() {
        return new Response(false, 'Internal Server', null, 500);
    }

    async createUser(userRepo: Repository<User>, payload: User) {
        try {
            let user = await userRepo.findOne({ where: { user_id: payload.user_id } });

            if (user) {
                return { success: false, message: "User already exists!", data: null }
            }

            user = await userRepo.save(payload);

            console.log(user);
            const token = await this.getJwtToken(user.user_id);

            return { success: true, message: "Registed successfully!", data: { token } }

        } catch (error) {
            console.log(error);
            if (error instanceof TypeORMError) {
                return { success: false, message: error.message, data: null }
            }
            return { success: false, message: error, data: null }
        }
    }

    async findUserById(userRepo: Repository<User>, payload: { id: string }) {
        try {
            const user = await userRepo.findOne({ where: { user_id: payload.id } });

            if (!user) {
                return new Response(false, 'No such user', { userExists: false, user: null });
            }

            return new Response(true, '', { userExists: true, user });
        } catch (error) {
            console.log(error);
            return new Response(false, "Internal server error", null, 500)
        }
    }

    async findUserByIdUserNameOrEmail(userRepo: Repository<User>, payload: { user_id?: string, userName?: string, email?: string }) {
        try {
            console.log(payload);
            const user = await userRepo.findOne({ where: payload });

            if (!user || (!payload.user_id && !payload.userName && !payload.email)) {
                return new Response(false, 'No such user exists!', { userExists: false, user: null });
            }
            return new Response(true, '', { userExists: true, user });
        } catch (error) {
            console.log(error);
            return new Response(false, "Internal server error", null, 500)
        }
    }

    async loginUser(userRepo: Repository<User>, payload: { user_id?: string }) {
        try {
            const res = await this.findUserByIdUserNameOrEmail(userRepo, payload);
            if (res.success == true) {
                const token = await this.getJwtToken(payload.user_id!);
                return new Response(true, '', { token });
            }
            return new Response(false, 'No such user exists!', null);
        } catch (error) {
            console.log(error);
            return new Response(false, "Internal server error", null, 500)
        }

    }

    async followUser(userRepo: Repository<User>, payload: { current_user: User, target_user_id: string }) {
        try {
            const target_user = await userRepo.findOne({ where: { user_id: payload.target_user_id }, relations: ['following', 'followedBy'] });

            if (!target_user) {
                return new Response(false, 'No target user found', null);
            }

            const { followedBy } = target_user;
            const { following } = payload.current_user;

            following.push(target_user);
            followedBy.push(payload.current_user);

            await userRepo.save(payload.current_user);
            await userRepo.save(target_user);

            let user = await userRepo.find({ relations: ['following', 'followedBy'] });
            console.log(user);
            return new Response(true, 'Followed', null);

        } catch (error) {
            if (error instanceof TypeORMError) {
                return new Response(false, error.message, null);
            }
            return ErrorHandler.internalServer();
        }
    }

    async unFollowUser(userRepo: Repository<User>, payload: { current_user: User, target_user_id: string }) {
        try {
            const target_user = await userRepo.findOne({ where: { user_id: payload.target_user_id }, relations: ['following', 'followedBy'] });

            if (!target_user) {
                return new Response(false, 'No target user found', null);
            }


            payload.current_user.following = payload.current_user.following.filter((user) => {
                return user.user_id != target_user.user_id;
            });

            target_user.followedBy = target_user.followedBy.filter((user) => {
                return user.user_id != payload.current_user.user_id;
            })

            await userRepo.save(payload.current_user);
            await userRepo.save(target_user);

            return new Response(true, 'UnFollowed', null);

        } catch (error) {
            if (error instanceof TypeORMError) {
                return new Response(false, error.message, null);
            }
            return ErrorHandler.internalServer();
        }
    }

    async getPosts(userRepo: Repository<User>, payload: { current_user: User, target_user_id: string }) {
        try {
            const target_user = await userRepo.findOne({
                where: { user_id: payload.target_user_id }, relations: {
                    posts: true
                }
            });

            if (!target_user) {
                return new Response(false, 'No such user', null);
            }

            return new Response(true, '', { posts: target_user.posts });
        } catch (error) {
            // if (error instanceof TypeORMError) {
            //     return ErrorHandler.unprocessableInput(error.message);
            // }
            console.log(error);
            return ErrorHandler.internalServer();
        }
    }

    async getUserByUserId(userRepo: Repository<User>, payload: { current_user: User, target_user_id: string }) {
        try {
            const target_user = await userRepo.findOne({
                where: { user_id: payload.target_user_id },
                relations: {
                    followedBy: true,
                    following: true
                }
            })
            return new Response(true, '', { user: target_user });
        } catch (error) {
            console.log(error);
            return ErrorHandler.internalServer();
        }
    }

    async searchUser(userRepo: Repository<User>, payload: { query: string, current_user: User }) {
        try {
            let regex = new RegExp(payload.query);
            const { query } = payload;
            let substrs: Array<string> = [];
            let temp = "";
            for (let i = 0; i < query.length; i++) {
                temp = temp.concat(query[i]);
                substrs.push(temp);
            }

            substrs = substrs.reverse();
            let users: Array<User> = []
            for (let i = 0; i < substrs.length; i++) {
                let user = await userRepo.find({ where: { name: Like(`${substrs[i]}%`)}, relations: {following: true, followedBy: true} });
                users = user.concat(user);
            }

            let user = await userRepo.find({ where: { name: Like(`%${query}%`) }, relations: {following: true, followedBy: true} });
            users = users.concat(user);
            let uniqueUsers: Array<string> = [];

            users.map((user) => {
                let json = JSON.stringify(user);
                if (!uniqueUsers.includes(json)) uniqueUsers.push(json);
            })
            let allUsers: User[] = [];
            uniqueUsers.map((str) => allUsers.push(JSON.parse(str)));
            return new Response(true, '', { users: allUsers });
        } catch (error) {
            console.log(error);
            return ErrorHandler.internalServer();
        }
    }

    async searchByUserName(userRepo: Repository<User>, payload: { query: string, current_user: User }) {
        try {
            let regex = new RegExp(payload.query);
            const { query } = payload;
            let substrs: Array<string> = [];
            let temp = "";
            for (let i = 0; i < query.length; i++) {
                temp = temp.concat(query[i]);
                substrs.push(temp);
            }

            substrs = substrs.reverse();
            let users: Array<User> = []
            for (let i = 0; i < substrs.length; i++) {
                let user = await userRepo.find({ where: { userName: Like(`${substrs[i]}%`) }, relations: {following: true, followedBy: true} });
                users = user.concat(user);
            }

            let user = await userRepo.find({ where: { userName: Like(`%${query}%`) }, relations: {
                following: true,
                followedBy: true
            } });
            users = users.concat(user);
            let uniqueUsers: Array<string> = [];

            users.map((user) => {
                let json = JSON.stringify(user);
                if (!uniqueUsers.includes(json)) uniqueUsers.push(json);
            })
            let allUsers: User[] = [];
            uniqueUsers.map((str) => allUsers.push(JSON.parse(str)));
            return new Response(true, '', { users: allUsers });
        } catch (error) {
            console.log(error);
            return ErrorHandler.internalServer();
        }
    }


}

export default Service;