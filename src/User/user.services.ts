import { Repository, TypeORMError } from "typeorm";
import { User } from "../entities/User";
import { verify, decode, sign } from 'jsonwebtoken';
import { Response } from "../interfaces/response";
class Service {

    private async getJwtToken(id: string): Promise<string> {
        const token = await sign({ id: id }, process.env.JWT_SECRET ? process.env.JWT_SECRET : 'RANDOMSTRING', {
            expiresIn: 30
        })
        return token;
    }

    async createUser(userRepo: Repository<User>, payload: User) {
        try {
            let user = await userRepo.findOne({ where: { id: payload.id } });

            if (user) {
                return { success: false, message: "User already exists!", data: null }
            }

            user = await userRepo.save(payload);

            console.log(user);
            const token = await this.getJwtToken(user.id);

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
            const user = await userRepo.findOne({ where: { id: payload.id } });

            if (!user) {
                return new Response(false, 'No such user', { userExists: false, user: null });
            }

            return new Response(true, '', { userExists: true, user });
        } catch (error) {
            console.log(error);
            return new Response(false, "Internal server error", null, 500)
        }
    }

    async findUserByIdUserNameOrEmail(userRepo: Repository<User>, payload: { id?: string, userName?: string, email?: string }) {
        try {
            console.log(payload);
            const user = await userRepo.findOne({ where: payload });

            if (!user || (!payload.id && !payload.userName && !payload.email)) {
                return new Response(false, 'No such user exists!', { userExists: false, user: null });
            }
            return new Response(true, '', { userExists: true, user });
        } catch (error) {
            console.log(error);
            return new Response(false, "Internal server error", null, 500)
        }
    }

    async loginUser(userRepo: Repository<User>, payload: { id?: string }) {
        try {
            const res = await this.findUserByIdUserNameOrEmail(userRepo, payload);
            if(res.success == true){
                const token = await this.getJwtToken(payload.id!);
                return new Response(true, '', {token});
            }
            return new Response(false, 'No such user exists!', null);
        } catch (error) {
            console.log(error);
            return new Response(false, "Internal server error", null, 500)
        }

    }


}

export default Service;