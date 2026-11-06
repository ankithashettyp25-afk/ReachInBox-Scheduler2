import axios from 'axios';

export async function sendSlackRateLimitAlert(webhookUrl: string, sender: string, limit: number) {
  if (!webhookUrl) return;
  try {
    await axios.post(webhookUrl, {
      text: `🚨 *ReachInbox Rate Limit Alert*\nSender \`${sender}\` reached the hourly limit of *${limit} emails/hour*. Future jobs are being rescheduled safely.`,
    });
    console.log(`Slack rate limit notification sent for ${sender}`);
  } catch (err: any) {
    console.error('Failed to send Slack alert:', err.message);
  }
}