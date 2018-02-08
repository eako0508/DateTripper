const express = require('express');
const app = express();
const {router: userRouter} = require('./users');
//app.use(express.static('public'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use('/', express.static('public'));
app.use('/users', userRouter);
app.listen(process.env.PORT || 8080);

module.exports = {app};