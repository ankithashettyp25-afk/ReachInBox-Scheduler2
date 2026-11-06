import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { Email } from '../models/Email';
import { getEtherealTransporter } from '../services/ethereal';
import { checkAndIncrementRateLimit } from '../services/rateLimiter';
import { sendSlackRateLimitAlert } from '../services/slack';
import { esClient } from '../config/elasticsearch';

export function startEmailWorker() {
  const concurrency = Number(process.env.WORKER_CONCURRENCY) || 5;

  const worker = new Worker(
    'email-queue',
    async (job: Job) => {
      const { emailId } = job.data;
      const email = await Email.findByPk(emailId);
      if (!email) return;

      // Rate limit check across distributed instances
      const { allowed, retryDelayMs } = await checkAndIncrementRateLimit(email.senderEmail, email.hourlyLimit);

      if (!allowed) {
        if (email.slackWebhookUrl) {
          await sendSlackRateLimitAlert(email.slackWebhookUrl, email.senderEmail, email.hourlyLimit);
        }
        await email.update({ status: 'RATE_LIMITED' });

        // Reschedule job to next window without dropping
        await emailQueue.add('send-email', { emailId: email.id }, { delay: retryDelayMs });
        return;
      }

      // Enforce minimum delay provider throttling
      if (email.delayBetweenMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, email.delayBetweenMs));
      }

      // Send Email via Ethereal SMTP
      const { transporter } = await getEtherealTransporter();
      const info = await transporter.sendMail({
        from: `"${email.senderEmail}" <${email.senderEmail}>`,
        to: email.recipientEmail,
        subject: email.subject,
        html: email.body,
      });

      console.log(`[Email Sent] Message ID: ${info.messageId} | Preview: ${nodemailer.getTestMessageUrl(info)}`);

      const now = new Date();
      await email.update({ status: 'SENT', sentAt: now });

      // Index into Elasticsearch
      await esClient.index({
        index: 'emails',
        id: email.id,
        document: {
          id: email.id,
          idempotencyKey: email.idempotencyKey,
          senderEmail: email.senderEmail,
          recipientEmail: email.recipientEmail,
          subject: email.subject,
          body: email.body,
          status: 'SENT',
          scheduledAt: email.scheduledAt,
          sentAt: now,
          createdAt: email.createdAt,
        },
      });
    },
    { connection: redisConnection, concurrency }
  );

  worker.on('failed', async (job, err) => {
    if (job) {
      await Email.update({ status: 'FAILED', errorMessage: err.message }, { where: { id: job.data.emailId } });
    }
  });

  console.log(`BullMQ Worker started with concurrency: ${concurrency}`);
}
import { emailQueue } from './emailQueue';
import nodemailer from 'nodemailer';