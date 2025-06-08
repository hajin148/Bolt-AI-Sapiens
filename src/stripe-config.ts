export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    priceId: 'price_1RXXKoFYsVEMdhwVgnq4vVqV',
    name: 'AI Sapiens Subscription',
    description: 'AI Sapiends Subscription "Test" worth $1',
    mode: 'subscription'
  }
];