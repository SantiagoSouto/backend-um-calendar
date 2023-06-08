const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('./config/passport.js');

// Routers
const userRouter = require('./router/user.js');
const subjectRouter = require('./router/subject.js');
const eventRouter = require('./router/event.js');

dotenv.config();

// Constants
const PORT = process.env.PORT || 3000;
const MONGO_URL = `mongodb+srv://umcalendar:${process.env.MONGODB_PASSWORD}@cluster0.wnudgqa.mongodb.net/?retryWrites=true&w=majority`;
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30,
  });

const app = express();

// Mongo connection
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (err) => {
    throw err;
    process.exit(1);
})

// Install middlewares
app.use(helmet());
app.use(limiter);
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

// Routers
app.use('/user', userRouter);
app.use('/subject', passportConfig.isAuthenticated, subjectRouter);
app.use('/event', passportConfig.isAuthenticated, eventRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));