import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";
@Entity()
export class User{
    @PrimaryColumn()
    @IsNotEmpty({message: 'id required'})
    user_id: string

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

    @Column({default: null})
    gender: string;

    @Column({default: null})
    profile_image: string;

    @ManyToMany(() => User, (user)=> user.followedBy)
    @JoinTable()
    following: User[]

    @ManyToMany(() => User, (user)=> user.following)
    followedBy: User[]


    @OneToMany(()=> Post, (post)=> post.user)
    posts: Post[]

    @ManyToMany(() => Post, post => post.likes)
    likes: Post[]

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[]

}