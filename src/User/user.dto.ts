import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export interface UserActions{
    user_id: string;
    name: string;
    email: string;
    userName: string;
    bio?: string;
    gender?: string;
    profile_image?: string;
}

export interface FollowActions{
    current_user: string;
    target_user: string;
}

export interface UpdateProfileAction{
    name?: string
    userName?: string
    gender?: string
    bio?: string
    profile_image?: string;

}