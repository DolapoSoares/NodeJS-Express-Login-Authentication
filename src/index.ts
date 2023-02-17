import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import { dataSource } from "./datasource";
import { routes } from './routes';

dataSource.connect().then(() => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin: ['http://l127.0.0.1:3306', 'http://127.0.0.1:8080', 'http://127.0.0.1:4200'],
        credentials: true
    }));

    routes(app);

    app.listen(3306, () => {
        console.log('Listening to port 8000');
    })
})