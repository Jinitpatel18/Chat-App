import express from 'express';
import cors from 'cors';
import messageRoutes from './routes/messageRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;