const express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    RateLimit = require('express-rate-limit'),
    cors = require('cors'),
    swaggerJsdoc = require('swagger-jsdoc'),
    swaggerUi = require('swagger-ui-express'),
    MongoStore = require('connect-mongo'),
    dotenv = require('dotenv'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    passportConfig = require('./config/passport.js');



// Routers
const userRouter = require('./routes/user.js');
const subjectRouter = require('./routes/subject.js');
const eventRouter = require('./routes/event.js');

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

// Docs
app.use(express.static('assets'));
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "UM Calendar API",
        version: "1.0.0",
        description:
          "Este es el servidor API que utilizará la aplicacion de UM Calendar.",
      },
      servers: [
        {
          url: "https://um-calendar.onrender.com",
        },
      ],
    },
    apis: ['./routes/user.js', './routes/subject.js', './routes/event.js'],
};
  
const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "UM Calendar API",
        customfavIcon: "/um_icon.ico"
    })
);

// Routers
app.use('/user', userRouter);
app.use('/subject', passportConfig.isAuthenticated, subjectRouter);
app.use('/event', passportConfig.isAuthenticated, eventRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));