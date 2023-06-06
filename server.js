const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('./config/passport.js');

dotenv.config();

// Constants
const PORT = 3000;
const MONGO_URL = `mongodb+srv://umcalendar:${process.env.MONGODB_PASSWORD}@cluster0.wnudgqa.mongodb.net/?retryWrites=true&w=majority`;

const app = express();

// Mongo connection
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (err) => {
    throw err;
    process.exit(1);
})

// Install middlewares
app.use(session({
    secret: "THIS IS A SECRET",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGO_URL })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello World!");
})

// User controls
const userController = require('./controllers/user');
app.post('/signup', userController.postSignUp);
app.post('/login', userController.postLogin);
app.get('/logout', passportConfig.isAuthenticated, userController.logout);

app.get('/userInfo', passportConfig.isAuthenticated, (req, res) => {
    res.json(req.user);
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));