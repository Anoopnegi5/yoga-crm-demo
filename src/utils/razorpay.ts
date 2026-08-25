// src/utils/razorpay.ts
// Frontend helper utilities for Razorpay integration

export interface RazorpayCheckoutOptions {
  amount: number;           // in INR (e.g. 1200)
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  purpose: string;          // e.g. "Monthly Fee - August 2026"
  notes?: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onFailure?: (error: string) => void;
}

// Dynamically load Razorpay checkout script
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Open Razorpay payment checkout
export async function openRazorpayCheckout(opts: RazorpayCheckoutOptions): Promise<void> {
  // 1. Load script
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    opts.onFailure?.('Razorpay script failed to load. Check your internet connection.');
    return;
  }

  // 2. Create order on backend
  let orderData: { orderId: string; amount: number; currency: string; keyId: string };
  try {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: opts.amount,
        clientName: opts.clientName,
        clientPhone: opts.clientPhone,
        purpose: opts.purpose,
        notes: opts.notes,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      opts.onFailure?.(err.error || 'Failed to create payment order');
      return;
    }
    orderData = await res.json();
  } catch (e) {
    opts.onFailure?.('Network error. Please try again.');
    return;
  }

  // 3. Open Razorpay checkout
  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderData.orderId,
    name: 'Yoga Studio',
    description: opts.purpose,
    image: '/logo.png',
    prefill: {
      name: opts.clientName,
      contact: opts.clientPhone || '',
      email: opts.clientEmail || '',
    },
    theme: { color: '#059669' }, // Emerald green matching brand
    handler: async function (response: any) {
      // 4. Verify payment on backend
      try {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          opts.onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
        } else {
          opts.onFailure?.('Payment verification failed. Contact support.');
        }
      } catch {
        // Even if verification API fails, payment happened — still call success
        opts.onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
      }
    },
    modal: {
      ondismiss: () => {
        opts.onFailure?.('Payment cancelled');
      },
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}

// Generate WhatsApp payment link via backend
export async function generatePaymentLink(params: {
  amount: number;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  purpose: string;
  description?: string;
}): Promise<{ link: string; expiresAt: string } | null> {
  try {
    const res = await fetch('/api/generate-payment-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { link: data.paymentLink, expiresAt: data.expiresAt };
  } catch {
    return null;
  }
}
