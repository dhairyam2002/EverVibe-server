import express from 'express';
const app = express();
import AppDataSource from './dbConfig';

AppDataSource.initialize().then(()=> {
    console.log('Connected to Database')}
).catch((err) => console.log(err));


app.listen(3000, () => {
    console.log(`Server running on PORT 3000`);
});


