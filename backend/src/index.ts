import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { ExpressAdapter } from '@bull-board/express';

import { sequelize } from './config/db.js';
import { initElasticsearch } from './config/elasticsearch';
import { emailQueue } from './queues/emailQueue';
import { startEmailWorker } from './queues/emailWorker';
import emailRoutes from './routes/email';
import slackRoutes from './routes/slack';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up BullBoard Admin Dashboard
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter: serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
app.use('/api/emails', emailRoutes);
app.use('/api/slack', slackRoutes);

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await sequelize.sync();
  console.log('Database synced successfully.');
  await initElasticsearch();

  startEmailWorker();

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`BullMQ UI Dashboard active at http://localhost:${PORT}/admin/queues`);
  });
}

bootstrap();