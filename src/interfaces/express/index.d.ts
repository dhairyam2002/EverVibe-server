declare namespace Express{
    import { User } from "../../entities/User"
    interface Request{
        user?: User
    }
}