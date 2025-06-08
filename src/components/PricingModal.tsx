import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import CheckoutButton from './CheckoutButton';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <div className="grid gap-6">
            {STRIPE_PRODUCTS.map((product) => (
              <div key={product.priceId} className="border rounded-lg p-6 bg-blue-50 hover:border-blue-400 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className="inline-block mt-1 text-sm text-green-600 font-medium">
                      Test Subscription
                    </span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Best Value
                  </span>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">$1.00</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">AI Tool Recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Personalized Learning Path</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Cost Estimates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Priority Support</span>
                  </li>
                </ul>
                <CheckoutButton 
                  product={product} 
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-4">
              All plans come with a 14-day money-back guarantee
            </p>
            <Button variant="outline" asChild>
              <Link to="/pricing">View Full Pricing Page</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;