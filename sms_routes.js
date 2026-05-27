// sms_routes.js — Celcom Africa SMS proxy
import { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post('/send', async (req, res) => {
    try {
        const { phone, message } = req.body;

        if (!phone || !message) {
            return res.status(400).json({ error: 'phone and message are required' });
        }

        const apiKey    = process.env.CELCOM_API_KEY    || '17323514aa8ce2613e358ee029e65d99';
        const partnerID = process.env.CELCOM_PARTNER_ID || '928';
        const shortcode = process.env.CELCOM_SHORTCODE  || 'MularCredit';

        const url = `https://isms.celcomafrica.com/api/services/sendsms/?apikey=${apiKey}&partnerID=${partnerID}&message=${encodeURIComponent(message)}&shortcode=${shortcode}&mobile=${phone}`;

        console.log(`📡 Sending SMS to ${phone}...`);

        const response = await fetch(url, { method: 'GET' });
        const text     = await response.text();

        let parsed;
        try { parsed = JSON.parse(text); } catch { parsed = text; }

        const lower = text.toLowerCase();
        if (!response.ok || lower.includes('error') || lower.includes('invalid') || lower.includes('unauthorized')) {
            console.error('❌ SMS failed:', text);
            return res.status(502).json({ error: 'SMS provider rejected the request', details: parsed });
        }

        console.log(`✅ SMS sent to ${phone}`);
        res.json({ success: true, details: parsed });

    } catch (error) {
        console.error('❌ SMS error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to send SMS' });
    }
});

// Bulk send helper
router.post('/send-bulk', async (req, res) => {
    try {
        const { recipients } = req.body; // [{ phone, message }]

        if (!Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ error: 'recipients array is required' });
        }

        const results = [];
        for (const { phone, message } of recipients) {
            try {
                const apiKey    = process.env.CELCOM_API_KEY    || '17323514aa8ce2613e358ee029e65d99';
                const partnerID = process.env.CELCOM_PARTNER_ID || '928';
                const shortcode = process.env.CELCOM_SHORTCODE  || 'MularCredit';
                const url = `https://isms.celcomafrica.com/api/services/sendsms/?apikey=${apiKey}&partnerID=${partnerID}&message=${encodeURIComponent(message)}&shortcode=${shortcode}&mobile=${phone}`;
                const response = await fetch(url, { method: 'GET' });
                const text = await response.text();
                results.push({ phone, success: !text.toLowerCase().includes('error'), details: text });
            } catch (err) {
                results.push({ phone, success: false, error: err.message });
            }
        }

        const success = results.filter(r => r.success).length;
        console.log(`✅ Bulk SMS: ${success}/${recipients.length} sent`);
        res.json({ success: success, failed: recipients.length - success, results });

    } catch (error) {
        res.status(500).json({ error: error.message || 'Bulk send failed' });
    }
});

export default router;
