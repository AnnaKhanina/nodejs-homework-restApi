const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { createNotFoundHttpError } = require('./helpers/index');

const contactsRouter = require('./routes/api/contacts');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
  res.send('DataBase of Contacts');
});

app.use('/api/contacts', contactsRouter);

app.use(createNotFoundHttpError);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
