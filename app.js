import dotenv from 'dotenv';
dotenv.config()

// extra security packages
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit'

// swagger
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
const swaggerDocument = YAML.load('./swagger.yaml')

import express from 'express';
const app = express()

import 'express-async-errors'

// connectDB
import connectDB from './db/connect.js'
// Auth middleware
import authenticateUser from './middleware/auth.js'
// routes
import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'

// middleware
import errorHandlerMiddleware from './middleware/error-handler.js'
import notFoundMiddleware from './middleware/not-found.js'

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);
app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/',(req, res) => {
    res.send('<h1>jobs API</h1><a href="/api-docs">Documentation</a>');
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

// middleware
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3300;

const start = async() => {
    await connectDB(process.env.MONGO_URI);
    app.listen(port,()=> {
        console.log(`Server is listening on PORT ${port}`);
    })
}

start();