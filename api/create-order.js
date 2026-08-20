// api/create-order.js
// Vercel Serverless Function — creates Razorpay order via direct REST API (zero-dependency, native fetch)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Razorpay keys not configured in environment variables');
    return res.status(500).json({ error: 'Payment gateway not configured' });
  }

  try {
    const { amount, currency = 'INR', clientName, clientPhone, purpose, notes } = req.body || {};

    if (!amount || Number(amount) < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const orderPayload = {
      amount: Math.round(Number(amount) * 100), // paise
      currency,
      receipt: `yog_${Date.now()}`,
      notes: {
        clientName: clientName || '',
        clientPhone: clientPhone || '',
        purpose: purpose || 'yoga_fee',
        extraNotes: notes || '',
        studio: 'Yoganjali — Anjali Negi'
      }
    };

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await rzpRes.json();

    if (!rzpRes.ok) {
      console.error('Razorpay order creation error:', data);
      return res.status(rzpRes.status).json({ 
        error: data.error?.description || 'Failed to create payment order',
        details: data 
      });
    }

    return res.status(200).json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId
    });
  } catch (err) {
    console.error('Server error creating Razorpay order:', err);
    return res.status(500).json({ error: 'Server error processing payment order', details: err.message });
  }
}
