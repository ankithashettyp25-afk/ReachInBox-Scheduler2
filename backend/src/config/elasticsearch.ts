import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

export async function initElasticsearch() {
  try {
    const exists = await esClient.indices.exists({ index: 'emails' });
    if (!exists) {
      await esClient.indices.create({
        index: 'emails',
        mappings: {
          properties: {
            id: { type: 'keyword' },
            idempotencyKey: { type: 'keyword' },
            senderEmail: { type: 'keyword' },
            recipientEmail: { type: 'keyword' },
            subject: { type: 'text' },
            body: { type: 'text' },
            status: { type: 'keyword' },
            scheduledAt: { type: 'date' },
            sentAt: { type: 'date' },
            createdAt: { type: 'date' },
          },
        },
      });
      console.log('Elasticsearch "emails" index created.');
    }
  } catch (error) {
    console.error('Elasticsearch initialization error:', error);
  }
}