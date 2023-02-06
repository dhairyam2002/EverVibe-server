import { Response } from "./interfaces/response";

export class ErrorHandler{
    static internalServer(){
        return new Response(false, 'Internal server error', null, 500);
    }
    static unprocessableInput(message: string){
        return new Response(false, message, null, 422);
    }

    static unauthorized(){
        return new Response(false, 'Authentication required', null, 401);
    }
}