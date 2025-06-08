import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { STRIPE_PRODUCTS } from '../stripe-config';
import CheckoutButton from '../components/CheckoutButton';
import SubscriptionStatus from '../components/SubscriptionStatus';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Check } from 'lucide-react';

const PricingPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Get access to premium AI tools and features
          </p>
        </div>

        {currentUser && (
          <div className="mb-8 flex justify-center">
            <SubscriptionStatus />
          </div>
        )}

        <div className="grid md:grid-cols-1 gap-8 max-w-md mx-auto">
          {STRIPE_PRODUCTS.map((product) => (
            <Card key={product.priceId} className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$1.00</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-center">
                  {product.description}
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>AI Tool Recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Personalized Learning Path</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Cost Estimates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Priority Support</span>
                  </li>
                </ul>

                <CheckoutButton 
                  product={product} 
                  className="w-full"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All plans come with a 14-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;