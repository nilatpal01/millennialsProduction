const express = require('express');
const compression = require('compression');
const cors = require('cors');

const postRouter = require('./routes/postRoutes');

const app = express();

//implement cors
app.use(cors());

app.options('*', cors());

if (process.env.NODE_ENV === 'development') {
  console.log('development');
}

app.use(express.json());

app.use(compression());

app.use('/api/v1/post', postRouter);

module.exports = app;
