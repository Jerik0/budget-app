import 'dotenv/config'
import express from 'express'
import transactionRouter from './routers/transaction-router.js';
import path from 'path'
import { fileURLToPath } from 'url';
import * as bodyParser from 'express'
import runDbMigrations from './db/migrations/index.js';
const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/transactions', transactionRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/test', (req, res) => {
  console.log(res.status);
  const data = { message: 'Hello from Express server!' };
  res.json(data);
});

async function start() {
  await runDbMigrations();

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
}
start();
