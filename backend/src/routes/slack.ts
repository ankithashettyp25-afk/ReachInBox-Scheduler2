import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/connect', (req, res) => {
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=incoming-webhook&redirect_uri=${process.env.SLACK_REDIRECT_URI}`;
  res.redirect(slackAuthUrl);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
      },
    });

    const webhookUrl = response.data.incoming_webhook?.url;
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?slack_webhook=${encodeURIComponent(webhookUrl || '')}`);
  } catch (err: any) {
    res.status(500).send('Slack authorization failed');
  }
});

export default router;