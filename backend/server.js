import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import postRoutes from './routes/postRoutes.js';
import socialAuthRoutes from './routes/socialAuthRoutes.js';
import musicRoutes from './routes/musicRoutes.js';
import cors from 'cors';
import cookieSession from 'cookie-session';
import passport from 'passport';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// set up session cookies
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_SECRET],
}));
app.use(passport.initialize());
app.use(passport.session());

// Handling CORS 
app.use(cors({
  origin: '*'
}))

app.use((req, res, next) => {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// setting up routes
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/socialAuth', socialAuthRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/music', musicRoutes);


const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

export const server = app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
});
