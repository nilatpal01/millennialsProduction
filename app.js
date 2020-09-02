const path = require('path');
const express = require('express');
const compression = require('compression');
// const path=require('path');
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

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin-panel', function (req, res) {
  res.render('upload');
});

app.use('/api/v1/post', postRouter);

module.exports = app;