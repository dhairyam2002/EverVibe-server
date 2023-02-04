import express from 'express';
const app = express();

import userRoutes from './User/user.routes';

app.use(express.json());
app.use('/api/v1', userRoutes);


export default app;