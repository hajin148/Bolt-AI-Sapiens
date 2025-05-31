import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; 

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const { updateSubscription } = useAuth(); // get the function from context

const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
  // TODO: Integrate with Stripe or payment gateway here

  console.log(`Subscribing to ${plan} plan`);
  
  // Mark user as paid
  await updateSubscription(true);

  onClose();
};

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    // TODO: Implement actual payment processing
    console.log(`Subscribing to ${plan} plan`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <div className="border rounded-lg p-6 hover:border-blue-400 transition-all duration-300">
              <h3 className="text-xl font-semibold">Monthly</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold">$9.99</span>
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
              </ul>
              <Button
                className="w-full"
                onClick={() => handleSubscribe('monthly')}
              >
                Subscribe Monthly
              </Button>
            </div>

            {/* Yearly Plan */}
            <div className="border rounded-lg p-6 bg-blue-50 hover:border-blue-400 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">Yearly</h3>
                  <span className="inline-block mt-1 text-sm text-green-600 font-medium">
                    Save 20%
                  </span>
                </div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Best Value
                </span>
              </div>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold">$95.88</span>
                <span className="text-gray-600">/year</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">All Monthly Features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Priority Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Early Access to New Features</span>
                </li>
              </ul>
              <Button
                className="w-full"
                onClick={() => handleSubscribe('yearly')}
              >
                Subscribe Yearly
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            All plans come with a 14-day money-back guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;