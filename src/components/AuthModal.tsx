import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { JOB_OPTIONS, INTEREST_OPTIONS, JobType, InterestType } from '../types/Tool';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, Heart, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSwitchMode }) => {
  const { login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [job, setJob] = useState<JobType>(JOB_OPTIONS[0]);
  const [interests, setInterests] = useState<InterestType[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1: Basic Info, 2: Additional Info

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSignupStep(1); // Reset to first step when modal opens
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && signupStep === 1) {
      // Move to step 2 for signup
      setSignupStep(2);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await signup(email, password, {
          username,
          email,
          phone,
          job,
          interests,
        });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (error) {
      setError('Failed to ' + mode);
      console.error(error);
    }

    setLoading(false);
  };

  const toggleInterest = (interest: InterestType) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleBackToStep1 = () => {
    setSignupStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[95vh] overflow-y-auto relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Back Button for Step 2 */}
        {mode === 'signup' && signupStep === 2 && (
          <button
            onClick={handleBackToStep1}
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <ArrowLeft size={24} />
          </button>
        )}

        {/* Header */}
        <div className="px-8 pt-16 pb-8 text-center">
          {/* Logo */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg overflow-hidden">
            <img
              src="/logo.png"
              alt="AI Sapiens Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
              }}
            />
          </div>
          
          {/* Title and Description */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === 'login' 
                ? 'Welcome back!' 
                : signupStep === 1 
                  ? 'Create your account' 
                  : 'Tell us about yourself'
              }
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {mode === 'login' 
                ? 'Sign in to continue your AI journey' 
                : signupStep === 1
                  ? 'Join thousands of users discovering amazing AI tools'
                  : 'Help us personalize your experience'
              }
            </p>
          </div>

          {/* Progress Indicator for Signup */}
          {mode === 'signup' && (
            <div className="flex justify-center mt-8 space-x-2">
              <div className={`w-3 h-3 rounded-full transition-all ${signupStep === 1 ? 'bg-blue-500' : 'bg-blue-200'}`} />
              <div className={`w-3 h-3 rounded-full transition-all ${signupStep === 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
            </div>
          )}
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-r-xl mb-6 text-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {(mode === 'login' || (mode === 'signup' && signupStep === 1)) && (
              <>
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg placeholder-gray-400"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg placeholder-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                     minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg placeholder-gray-400"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-xs text-gray-500 mt-2">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Additional Information */}
            {mode === 'signup' && signupStep === 2 && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg placeholder-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Job Field</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={job}
                      onChange={(e) => setJob(e.target.value as JobType)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white text-lg"
                    >
                      {JOB_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    <Heart className="inline h-4 w-4 mr-2 text-pink-500" />
                    What interests you? (Select multiple)
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {INTEREST_OPTIONS.map((interest) => (
                      <label 
                        key={interest} 
                        className={`flex items-center space-x-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                          interests.includes(interest)
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          interests.includes(interest)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {interests.includes(interest) && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-base font-medium transition-colors ${
                          interests.includes(interest) ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {interest}
                        </span>
                        <input
                          type="checkbox"
                          checked={interests.includes(interest)}
                          onChange={() => toggleInterest(interest)}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing...
                  </div>
                ) : mode === 'login' ? (
                  'Sign In'
                ) : signupStep === 1 ? (
                  'Continue'
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Switch Mode */}
          {(mode === 'login' || (mode === 'signup' && signupStep === 1)) && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-base">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <button
                onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
                className="mt-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-lg"
              >
                {mode === 'login' ? 'Create account' : 'Sign in instead'}
              </button>
            </div>
          )}

          {/* Terms and Privacy */}
          {mode === 'signup' && signupStep === 2 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;