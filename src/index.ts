import app from './app';
import AppDataSource from './dbConfig';

AppDataSource.initialize().then(()=> {
    console.log('Connected to Database')}
).catch((err) => console.log(err));

app.listen(3000, () => {
    console.log(process.env.JWT_SECRET);
    console.log(`Server running on PORT 3000`);
});


