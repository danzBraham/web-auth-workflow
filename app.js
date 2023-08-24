import dotenv from 'dotenv';
import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';

import notFoundMiddleware from './middlewares/notFoundMiddleware.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ok');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server Listening on Port ${port}...`);
});
