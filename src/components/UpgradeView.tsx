import React from 'react';
import { Crown, Check, Zap, Shield, Headphones, BookOpen } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface UpgradeViewProps {
  user: User | null;
}

export function UpgradeView({ user }: UpgradeViewProps) {
  const features = [
    {
      icon: Zap,
      title: 'Unlimited AI Conversations',
      description: 'Chat with AI without any limits or restrictions',
    },
    {
      icon: BookOpen,
      title: 'Premium Learning Content',
      description: 'Access to exclusive courses and learning materials',
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: 'Get help faster with our priority support queue',
    },
    {
      icon: Headphones,
      title: '24/7 Customer Support',
      description: 'Round-the-clock assistance whenever you need it',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade to Pro</h1>
          <p className="text-xl text-gray-600">Unlock the full potential of AI Sapiens</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-600">5 AI conversations per day</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-600">Basic learning content</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-600">Community support</span>
              </li>
            </ul>
            
            <button className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white relative">
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-purple-200">/month</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-white mr-3" />
                <span>Unlimited AI conversations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-white mr-3" />
                <span>Premium learning content</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-white mr-3" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-white mr-3" />
                <span>Advanced AI features</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-white mr-3" />
                <span>Export conversations</span>
              </li>
            </ul>
            
            <button className="w-full py-3 px-4 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}