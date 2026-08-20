// api/generate-payment-link.js
// Vercel Serverless Function — creates Razorpay Payment Link via direct REST API

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Payment gateway not configured' });
  }

  try {
    const { amount, clientName, clientPhone, clientEmail, purpose, description } = req.body || {};

    if (!amount || Number(amount) < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const expiryTimestamp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

    const cleanPhone = clientPhone ? clientPhone.replace(/[^0-9]/g, '').slice(-10) : '';
    const customerObj = {
      name: clientName || 'Yoga Client'
    };
    if (cleanPhone && cleanPhone.length === 10 && !cleanPhone.startsWith('0000000000')) {
      customerObj.contact = `+91${cleanPhone}`;
    }
    if (clientEmail && clientEmail.includes('@')) {
      customerObj.email = clientEmail;
    }

    const payload = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      accept_partial: false,
      description: description || `Yoganjali Studio — ${purpose || 'Class Fee'}`,
      customer: customerObj,
      notify: {
        sms: !!customerObj.contact,
        email: !!customerObj.email
      },
      reminder_enable: true,
      notes: {
        purpose: purpose || 'yoga_fee',
        studio: 'Yoganjali — Anjali Negi'
      },
      expire_by: expiryTimestamp
    };

    const rzpRes = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await rzpRes.json();

    if (!rzpRes.ok) {
      console.error('Razorpay Payment Link creation error:', data);
      return res.status(rzpRes.status).json({
        error: data.error?.description || 'Failed to create payment link',
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      paymentLink: data.short_url,
      linkId: data.id,
      amount: data.amount / 100,
      expiresAt: new Date(expiryTimestamp * 1000).toLocaleDateString('en-IN')
    });
  } catch (err) {
    console.error('Payment link creation failed:', err);
    return res.status(500).json({ error: 'Failed to create payment link', details: err.message });
  }
}
