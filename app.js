import express from 'express';
import { PORT } from './configs/env.js';

import usersRouter from './routes/users.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.route.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/errors.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/workflows', workflowRouter)

app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send('Welcome to Subscription Tracker API');
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app;