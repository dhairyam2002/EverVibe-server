import express from 'express';
import dotenv from 'dotenv';
const app = express();

import userRoutes from './User/user.routes';

app.use(express.json());

dotenv.config({path: '.env'});
app.use('/api/v1', userRoutes);


export default app;