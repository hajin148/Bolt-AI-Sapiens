import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Coins, Zap, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { updateTokens, userTokens } = useAuth();
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchaseTokens = async () => {
    setPurchasing(true);
    try {
      // Mock successful payment - simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add 50 tokens to user's account (simulating successful payment)
      const newTokenCount = userTokens + 50;
      await updateTokens(newTokenCount);
      
      // Show success message and close modal
      console.log('Mock payment successful - added 50 tokens');
      onClose();
      
      // Optional: Show a success notification
      // You could add a toast notification here if desired
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      alert('Failed to add tokens. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Coins className="h-6 w-6 text-yellow-500" />
            Purchase Tokens
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Current Balance</span>
              </div>
              <span className="text-lg font-bold text-blue-900">{userTokens} tokens</span>
            </div>
          </div>

          {/* Token Package */}
          <div className="border-2 border-blue-500 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3" />
                BEST VALUE
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">50 Tokens</h3>
                  <p className="text-sm text-gray-600">Perfect for power users</p>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">$9.99</span>
                <span className="text-sm text-gray-500">one-time purchase</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">50 AI conversation tokens</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Generate unlimited learning spaces</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Access to all AI features</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Tokens never expire</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Priority AI response speed</span>
              </div>
            </div>

            {/* Purchase Button */}
            <Button
              onClick={handlePurchaseTokens}
              disabled={purchasing}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base"
            >
              {purchasing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Get 50 Tokens for $9.99
                </div>
              )}
            </Button>
          </div>

          {/* Token Usage Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">How tokens work:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 1 token = 1 AI conversation message</li>
              <li>• Creating learning spaces uses tokens based on complexity</li>
              <li>• Tokens are deducted only when AI generates responses</li>
              <li>• No monthly fees - pay only for what you use</li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              🔒 Secure payment processing powered by Stripe
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;