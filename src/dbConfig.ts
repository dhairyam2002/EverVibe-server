import 'reflect-metadata';
import { DataSource } from 'typeorm';
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
    entities: [User]
})

export default AppDataSource;
