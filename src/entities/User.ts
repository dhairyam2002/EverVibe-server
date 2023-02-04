import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { UserDto } from "../User/user.dto";

@Entity()
export class User{
    @PrimaryColumn()
    @IsNotEmpty({message: 'id required'})
    id: string

    @Column({unique: true, nullable: false})
    @IsNotEmpty({message: 'userName required'})
    userName: string

    @Column({nullable: false})
    @IsNotEmpty({message: 'name required'})
    name: string

    @Column({unique: true, nullable: false})
    @IsNotEmpty({message: 'email required'})
    @IsEmail({}, {message: 'Enter Valid email'})
    email: string

    @Column({default: null})
    @IsOptional()
    bio: string

    @ManyToMany(() => User, (user)=> user.followedBy)
    @JoinTable()
    following: User[]

    @ManyToMany(() => User, (user)=> user.following)
    followedBy: User[]


}