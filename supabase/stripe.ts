import { initStripe, createPaymentMethod, confirmPayment } from '@stripe/stripe-react-native';

// Initialize Stripe with your publishable key
export const initializeStripe = async () => {
  // Use env variable or fallback to a hardcoded test key for local/dev
  const key = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51QdQNm4F0S1g4Op0K2sq2qibZzjfE26kcpqjVYjachazX3zlkzCW3OH8lBrVIxy0MvOhwk2OHdMIn0hW2Uamhskh00OjXiGCFR'; // <-- Replace with your test key
  if (!key || key.startsWith('pk_live_') && __DEV__) {
    console.error('[Stripe] Publishable key is not set or is a live key in dev!');
    throw new Error('Stripe publishable key is not set!');
  }
  return await initStripe({
    publishableKey: key,
    merchantIdentifier: 'merchant.com.deltacoin', // Replace with your merchant identifier for Apple Pay
    urlScheme: 'deltacoin', // Required for 3D Secure and bank redirects
  });
};

// Create a payment intent via your Supabase backend
export const createPaymentIntent = async (amount: number, currency: string = 'bdt') => {
  try {
    console.log('[Stripe] Sending create-payment-intent request:', { amount, currency });
    const response = await fetch('https://qfbfisbbufwpxamnvowx.supabase.co/functions/v1/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmZpc2JidWZ3cHhhbW52b3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5Mjc3NTQsImV4cCI6MjA2MzUwMzc1NH0.imlTm5xDaDuagdUGxrqK1FQMwohBNybA7a4bzl2GLCo`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents/paisa
        currency,
      }),
    });
    const data = await response.json();
    console.log('[Stripe] Received create-payment-intent response:', data);
    return data;
  } catch (error) {
    console.error('[Stripe] Error creating payment intent:', error);
    throw error;
  }
};

// Process card payment
export const processCardPayment = async (paymentIntentClientSecret: string, cardDetails: {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  name?: string;
}) => {
  try {
    const { paymentIntent, error } = await confirmPayment(paymentIntentClientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails: {
          name: cardDetails.name,
        },
        // Note: You cannot pass raw card details here for PCI compliance. Card details should be collected via Stripe's CardField UI.
      },
    });

    if (error) {
      throw error;
    }

    return paymentIntent;
  } catch (error) {
    console.error('Error processing card payment:', error);
    throw error;
  }
};

