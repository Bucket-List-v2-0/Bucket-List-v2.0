require("dotenv").config();
const express = require("express");
const path = require("path");
const apiRouter = require('./api');

const { PORT } = process.env;
const app = express();
app.use(express.json())

app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) =>
    res.status(200).sendFile(path.resolve(__dirname, '../index.html'))
  );
}

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred. Check server logs for details.' },
  };
  const errorObj = { ...defaultErr, ...err};
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

module.exports = app;
