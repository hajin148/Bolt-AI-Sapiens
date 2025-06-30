import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CancelPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-12 w-12 text-red-400" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-gray-400 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* Info Box */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">No Payment Processed</span>
            </div>
            <p className="text-xs text-gray-500">
              You can try purchasing tokens again at any time. Your account remains unchanged.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleTryAgain}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Try Purchase Again
            </Button>
            
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team if you're experiencing issues with payment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelPage;