import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { serve, setup } from 'swagger-ui-express';
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import APIError from './errors/APIError';
import employeesRouter from './employee/router';
import userRoute from './users/router';
const app = express();
app.use(bodyParser.json());
const file = readFileSync('./docs/swagger.yaml', 'utf8');

const swaggerDocument = parse(file);

app.use('/api-docs', serve, setup(swaggerDocument));

app.get('/', (req: express.Request, res: express.Response) => {
  res.send(
    'Hello World!. Click here for <a href="./api-docs/">API Documentation</a>',
  );
});
app.set('etag', false);

// app.use('/employee', employeesRouter); user as ref

app.use('/auth', userRoute);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (error instanceof APIError) {
      res
        .status(error.status || 400)
        .send({ error: error.message, code: error.code });
    } else {
      res.status(500).send({ error: error.message });
    }
  },
);

export = app;
