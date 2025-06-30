export interface Product {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    priceId: 'price_1RfnCXFYsVEMdhwV6fVP9daJ',
    name: 'AISapiens 50 tokens',
    description: 'tokens purchase',
    mode: 'payment'
  }
];