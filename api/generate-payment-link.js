// api/generate-payment-link.js
// Vercel Serverless Function — generates a Razorpay Payment Link for WhatsApp sharing

const Razorpay = require('razorpay');

module.exports = async function handler(req, res) {
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
    const { amount, clientName, clientPhone, clientEmail, purpose, description } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Set expiry to 7 days from now
    const expiryTimestamp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      accept_partial: false,
      description: description || `Yoganjali Yoga Studio — ${purpose || 'Class Fee'}`,
      customer: {
        name: clientName || 'Yoga Client',
        contact: clientPhone ? `+91${clientPhone.replace(/[^0-9]/g, '').slice(-10)}` : undefined,
        email: clientEmail || undefined,
      },
      notify: {
        sms: !!clientPhone,
        email: !!clientEmail,
      },
      reminder_enable: true,
      notes: {
        purpose: purpose || 'yoga_fee',
        studio: 'Yoganjali — Anjali Negi',
      },
      expire_by: expiryTimestamp,
    });

    return res.status(200).json({
      success: true,
      paymentLink: paymentLink.short_url,
      linkId: paymentLink.id,
      amount: paymentLink.amount / 100,
      expiresAt: new Date(expiryTimestamp * 1000).toLocaleDateString('en-IN'),
    });
  } catch (err) {
    console.error('Payment link creation failed:', err);
    return res.status(500).json({ error: 'Failed to create payment link', details: err.message });
  }
};
