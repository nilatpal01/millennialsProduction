const express = require('express');
const compression = require('compression');

const postRouter = require('./routes/postRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  console.log('development');
}

app.use(express.json());

app.use(compression());

app.use('/api/v1/post', postRouter);

module.exports = app;
