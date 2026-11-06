import { Router } from 'express';
import crypto from 'crypto';
import { Email } from '../models/Email';
import { emailQueue } from '../queues/emailQueue';
import { esClient } from '../config/elasticsearch';

const router = Router();

// Schedule Email Endpoint
router.post('/schedule', async (req, res) => {
  try {
    const { senderEmail, recipients, subject, body, scheduledAt, delayBetweenMs, hourlyLimit, slackWebhookUrl } = req.body;

    const scheduledTime = new Date(scheduledAt).getTime();
    const delay = Math.max(0, scheduledTime - Date.now());

    const createdEmails = [];

    for (const recipientEmail of recipients) {
      // Idempotency Key Generation
      const idempotencyKey = crypto
        .createHash('sha256')
        .update(`${senderEmail}-${recipientEmail}-${scheduledAt}-${subject}-${body}`)
        .digest('hex');

      let email = await Email.findOne({ where: { idempotencyKey } });

      if (!email) {
        email = await Email.create({
          idempotencyKey,
          senderEmail,
          recipientEmail,
          subject,
          body,
          scheduledAt: new Date(scheduledAt),
          delayBetweenMs: delayBetweenMs || 2000,
          hourlyLimit: hourlyLimit || 200,
          slackWebhookUrl,
          status: 'SCHEDULED',
        });

        // Add to BullMQ with delay option
        await emailQueue.add(
          'send-email',
          { emailId: email.id },
          { delay, jobId: email.id } // Ensures job uniqueness in BullMQ
        );

        // Index in Elasticsearch
        await esClient.index({
          index: 'emails',
          id: email.id,
          document: email.toJSON(),
        });
      }
      createdEmails.push(email);
    }

    res.json({ success: true, count: createdEmails.length, data: createdEmails });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Scheduled Emails
router.get('/scheduled', async (req, res) => {
  const emails = await Email.findAll({ where: { status: ['SCHEDULED', 'RATE_LIMITED'] }, order: [['scheduledAt', 'ASC']] });
  res.json(emails);
});

// Fetch Sent Emails
router.get('/sent', async (req, res) => {
  const emails = await Email.findAll({ where: { status: 'SENT' }, order: [['sentAt', 'DESC']] });
  res.json(emails);
});

// Elasticsearch Full-text Search Endpoint
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      const emails = await Email.findAll();
      return res.json(emails);
    }

    const result = await esClient.search({
      index: 'emails',
      query: {
        multi_match: {
          query: String(q),
          fields: ['subject', 'body', 'recipientEmail', 'senderEmail'],
        },
      },
    });

    const hits = result.hits.hits.map((hit) => hit._source);
    res.json(hits);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;