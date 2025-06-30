import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Coins, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userTokens, refreshTokens } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh user tokens after successful payment
    const refreshUserData = async () => {
      if (currentUser) {
        try {
          await refreshTokens();
        } catch (error) {
          console.error('Error refreshing tokens:', error);
        }
      }
      setLoading(false);
    };

    // Add a small delay to ensure webhook has processed
    const timer = setTimeout(refreshUserData, 2000);
    return () => clearTimeout(timer);
  }, [currentUser, refreshTokens]);

  const handleContinue = () => {
    navigate('/prompts');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Processing your purchase...</h2>
          <p className="text-gray-400">Please wait while we update your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-400" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400 mb-6">
            Thank you for your purchase. Your tokens have been added to your account.
          </p>

          {/* Token Balance */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Current Balance</span>
            </div>
            <div className="text-2xl font-bold text-white">{userTokens} tokens</div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <span>Start Using AI Prompts</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Back to Home
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-2">What's next?</h3>
            <ul className="text-xs text-gray-400 space-y-1 text-left">
              <li>• Use tokens to chat with AI assistants</li>
              <li>• Generate personalized learning spaces</li>
              <li>• Access all premium AI features</li>
              <li>• Your tokens never expire</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessPage;