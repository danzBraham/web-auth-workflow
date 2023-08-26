import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';

// extra package
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// routers
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

// middlewares
import notFoundMiddleware from './middlewares/notFoundMiddleware.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res) => {
  res.send('Cryptonesia ID');
});

app.get('/api/v1', (req, res) => {
  // res.json({ cookies: req.cookies });
  res.json({ cookies: req.signedCookies });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server Listening on Port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
