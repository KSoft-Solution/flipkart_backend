require("./config/mongodb.config");
require('./config/cloudnary.config')
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const lusca = require("lusca");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("flash");
const path = require('path')

const errorMiddleware = require('./middlewares/error')
const routers = require('./routes/routes')

const app = express();
const mongoUrl = process.env.MONGO_URI;
const session_secret = process.env.SESSION_SECRET;

//setting all middleware
app.enable("trust proxy");
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
  })
);
app.use(cookieParser());
app.use(compression());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE,PUT");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: session_secret,
    store: MongoStore.create({
      mongoUrl,
      autoRemove: "native",
    }),
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true,
  })
);
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(cors());

__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    });
} else {
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}
app.use(routers);
app.use(errorMiddleware);


module.exports = app;
