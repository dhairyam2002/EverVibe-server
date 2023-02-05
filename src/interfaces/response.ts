export class Response{
    statusCode: number;
    success: boolean;
    message: string;
    data: any

    constructor(success: boolean, message: string, data: any, statusCode?: number){
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode ? statusCode : 200
    }
}