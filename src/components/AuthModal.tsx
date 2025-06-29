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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background with image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/background.png)',
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Modal content - Updated background to #121212 */}
      <div className="relative w-full max-w-[400px] h-[600px] bg-[#121212] rounded-[32px] overflow-hidden shadow-2xl">
        {/* Logo - Top left */}
        <div className="absolute top-6 left-6 z-10">
          <img
            src="https://cdn.jsdelivr.net/gh/hajin148/Bolt-AI-Sapiens@5492ed01ad294aebffa564b566ca04d1d36a7cd1/public/logo.png"
            alt="AI Sapiens Logo"
            className="h-8 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Back Button for Step 2 */}
        {mode === 'signup' && signupStep === 2 && (
          <button
            onClick={handleBackToStep1}
            className="absolute top-6 left-16 text-gray-400 hover:text-white transition-colors z-10"
          >
            <ArrowLeft size={24} />
          </button>
        )}

        {/* Progress Indicator for Signup */}
        {mode === 'signup' && (
          <div className="flex justify-center mt-20 space-x-2">
            <div className={`w-2 h-2 rounded-full transition-all ${signupStep === 1 ? 'bg-blue-500' : 'bg-gray-600'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${signupStep === 2 ? 'bg-blue-500' : 'bg-gray-600'}`} />
          </div>
        )}

        {/* Form Content - Removed pt-24 to eliminate top margin */}
        <div className="px-8 pt-16 pb-8 h-full flex flex-col bg-[#121212]">
          {error && (
            <div className="bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {/* Step 1: Basic Information */}
            {(mode === 'login' || (mode === 'signup' && signupStep === 1)) && (
              <div className="flex-1 space-y-6">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-[#2A2A2A] border border-[#404040] rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-400"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#2A2A2A] border border-[#404040] rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-14 py-4 bg-[#2A2A2A] border border-[#404040] rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-400"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
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
              </div>
            )}

            {/* Step 2: Additional Information */}
            {mode === 'signup' && signupStep === 2 && (
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#2A2A2A] border border-[#404040] rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Job Field</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={job}
                      onChange={(e) => setJob(e.target.value as JobType)}
                      className="w-full pl-12 pr-4 py-4 bg-[#2A2A2A] border border-[#404040] rounded-2xl focus:outline-none focus:border-blue-500 transition-colors appearance-none text-white"
                    >
                      {JOB_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-[#2A2A2A] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    <Heart className="inline h-4 w-4 mr-2 text-pink-500" />
                    What interests you? (Select multiple)
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {INTEREST_OPTIONS.map((interest) => (
                      <label 
                        key={interest} 
                        className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          interests.includes(interest)
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-[#404040] hover:border-gray-500 hover:bg-gray-800/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          interests.includes(interest)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                        }`}>
                          {interests.includes(interest) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          interests.includes(interest) ? 'text-blue-300' : 'text-gray-300'
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
              </div>
            )}

            {/* Submit Button - Updated to #440D97 */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-[#440D97] hover:bg-[#3A0B7F] text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing...
                  </div>
                ) : mode === 'login' ? (
                  'Login'
                ) : signupStep === 1 ? (
                  'Continue'
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Switch Mode - Updated to inline layout */}
          {(mode === 'login' || (mode === 'signup' && signupStep === 1)) && (
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-400 text-sm">
                  {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                </span>
                <button
                  onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-white font-semibold transition-colors hover:text-gray-300"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in instead'}
                </button>
              </div>
            </div>
          )}

          {/* Terms and Privacy */}
          {mode === 'signup' && signupStep === 2 && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">Privacy Policy</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;