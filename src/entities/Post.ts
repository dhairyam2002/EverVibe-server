import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";

@Entity()
export class Post{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    asset_link: string;
    
    @ManyToOne(() => User, (user) => user.posts)
    user: User


    @ManyToMany(()=> User, (user) => user.likes)
    @JoinTable()
    likes: User[]

    @OneToMany(() => Comment, comment => comment.post)
    comment: Comment[]

}