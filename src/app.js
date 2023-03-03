import express from 'express';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js'
import UserRouter from "./routers/user.router.js";
import AuthRouter from "./routers/auth.router.js";
import viewsRouter from './routers/views.router.js';
import passportLocalRouter from'./routers/passportLocal.router.js';
import githubRouter from './routers/github.routes.js';
import dotenv from 'dotenv';
import "./config/db.js";
if (process.env.MONGO_URI) import("./config/db.js");
import cookie from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import passport from 'passport';
import configPassport from './config/passport.config.js';
import webSocketService from './services/websocket.services.js';
import JWTRouter from './routers/jwt.router.js'

dotenv.config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));
app.use(cookie());
app.use(
  session({
    store: new mongoStore({
      mongoUrl: process.env.MONGO_URI,
      options: {
        userNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 100000 },
  }),
);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

configPassport(passport);
app.use(passport.initialize());
app.use(passport.session());



app.use((req, _res, next) => { //https://aaryanadil.com/pass-socket-io-to-express-routes-in-files/ 
    req.io = io;
    next();
});
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use("/api/users", UserRouter);
app.use("/api/auth", AuthRouter);
app.use("/", viewsRouter);
app.use('/api/passport', passportLocalRouter);
app.use('/api/github', githubRouter)
app.use("/api/jwt", JWTRouter);


const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => { 
console.log(`🚀 Server started on port http://localhost:${PORT}`)});
server.on('error', (err) => console.log(err));

const io = new Server(server);
webSocketService.websocketInit(io);