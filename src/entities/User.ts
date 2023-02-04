import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryColumn()
    id: string

    @Column({unique: true})
    userName: string

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @ManyToMany(() => User, (user)=> user.followedBy)
    @JoinTable()
    following: User[]

    @ManyToMany(() => User, (user)=> user.following)
    followedBy: User[]
}