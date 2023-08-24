import dotenv from 'dotenv';
import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';

// routers
import authRouter from './routes/authRoutes.js';

// middlewares
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

app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server Listening on Port ${port}...`);
});
