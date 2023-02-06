import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {nullable: false})
    content: string

    @ManyToOne(() => User, user => user)
    user: User

    @ManyToOne(() => Post, post => post.comment)
    post: Post
}