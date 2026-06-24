import React, { useState } from 'react';
import { Mail, Key, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../api/axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.devOtp) {
        setDevOtp(res.data.devOtp);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-3xl p-8 border border-border relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-gray-400">
            {step === 1 && "Enter your email to receive a recovery code"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Create a new, strong password"}
            {step === 4 && "Password successfully reset!"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Development only alert for when Google blocks SMTP */}
        {step === 2 && devOtp && (
          <div className="bg-primary/10 border border-primary/50 text-primary p-3 rounded-xl mb-6 text-sm text-center font-mono">
            [FIREWALL FALLBACK] Your OTP is: {devOtp}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOTP} 
              className="space-y-4"
            >
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" fullWidth className="mt-6 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? 'Sending...' : 'Send Recovery Code'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyOTP} 
              className="space-y-4"
            >
              <Input
                icon={Key}
                type="text"
                placeholder="6-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              <Button type="submit" variant="primary" fullWidth className="mt-6 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Code'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="w-full text-center text-sm text-gray-500 hover:text-white transition-colors mt-4"
              >
                Back to Email
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form 
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleResetPassword} 
              className="space-y-4"
            >
              <Input
                icon={Lock}
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button type="submit" variant="primary" fullWidth className="mt-6 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
                {!loading && <CheckCircle2 className="w-5 h-5" />}
              </Button>
            </motion.form>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <Button onClick={() => navigate('/login')} variant="primary" fullWidth>
                Back to Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <p className="text-center text-gray-400 mt-8 text-sm">
            Remembered your password?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
              Log in
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
