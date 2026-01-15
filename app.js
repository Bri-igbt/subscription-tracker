import express from 'express';
import { PORT } from './configs/env.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Subscription Tracker API');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;