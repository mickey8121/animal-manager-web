import { loadStripe, Stripe } from '@stripe/stripe-js';

import app from 'helpers/app';

const getStripe = async (): Promise<Stripe | null | void> => {
  if (app.stripeApiKey && app.stripeApiVersion) {
    const stripe = await loadStripe(app.stripeApiKey, {
      apiVersion: app.stripeApiVersion,
    });

    return stripe;
  }
};

export default getStripe;
