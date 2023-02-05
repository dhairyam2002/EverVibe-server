import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export interface UserActions{
    id: string;
    name: string;
    email: string;
    userName: string;
    bio?: string;
    gender?: string;
}

export interface FollowActions{
    current_user: string;
    target_user: string;
}