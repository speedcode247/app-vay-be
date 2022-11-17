const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const https = require('https');
const http = require('http');

const helmet = require('helmet');
const indexRouter = require('./routes/v1/index');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');
const fs = require('fs');

const db = require('./database/mongo');
const { connect } = require('./modules/socket/connects');
const app = express();
global.__basedir = __dirname;

const httpServer = http.createServer(app);
db.connection();
app.use(cors({
  origin: 'https://webchovay-demo-web.demo.poolata.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('uploads'))

app.use('/api/v1', indexRouter);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorHandler);

const socketIo = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
  allowEIO3: true,
});
connect(socketIo);

httpServer.listen(process.env.PORT || 5001, () =>
  console.log('Http running on ', process.env.PORT || 5001)
);
module.exports = app;
