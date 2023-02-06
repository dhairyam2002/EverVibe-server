import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Comment } from './entities/Comment';
import { Post } from './entities/Post';
import { User } from './entities/User';
const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'dhairya',
    password: 'dhairya',
    database: 'EverVibe',
    synchronize: true,
    logging: false,
    entities: [User, Comment, Post]
})

export default AppDataSource;
