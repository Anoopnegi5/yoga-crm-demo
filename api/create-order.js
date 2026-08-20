import Razorpay from 'razorpay';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Razorpay keys not configured');
    return res.status(500).json({ error: 'Payment gateway not configured' });
  }

  try {
    const { amount, currency = 'INR', clientName, clientPhone, purpose, notes } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), 
      currency,
      receipt: `yoganjali_${Date.now()}`,
      notes: {
        clientName: clientName || '',
        clientPhone: clientPhone || '',
        purpose: purpose || 'yoga_fee',
        extraNotes: notes || '',
        studio: 'Yoganjali — Anjali Negi',
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, 
    });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    return res.status(500).json({ error: 'Failed to create payment order', details: err.message });
  }
}
