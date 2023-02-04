import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
export class UserDto{
    @IsNotEmpty({message: 'id required'})
    id: string;

    @IsNotEmpty({message: 'Name required'})
    name: string;

    @IsNotEmpty({message: 'User name required'})
    userName: string;

    @IsNotEmpty({message: 'Email required'})
    @IsEmail({}, {context: {developerNote: 'Please enter valid email'}})
    email: string;

    @IsOptional()
    bio: string;
    
    constructor(user: UserDto){
        this.id = user.id;
        this.name = user.name,
        this.email = user.email,
        this.userName  = user.userName
    }
}