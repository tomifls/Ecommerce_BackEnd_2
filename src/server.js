import express from 'express';
import passport from 'passport';
import { authRouter } from "./router/auth.routes.js";
import { userRouter } from "./router/user.routes.js";
import { initializePassport } from "./config/passport.config.js";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';

const app = express();

const uri = 'mongodb://127.0.0.1:27017/entrega-final';

//Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(express.static('public'));

mongoose
    .connect((uri)
    .then(() => {
        console.log("Connected to the Database");
    })
    .catch(() => {
        console.log("Error Connecting to the database", error);
    })
);

//Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', passport.authenticate("jwt", { session: false }), userRouter);


const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);