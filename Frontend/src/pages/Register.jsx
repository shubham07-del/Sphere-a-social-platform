import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-secondary/20 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md p-8 rounded-3xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
          <p className="text-gray-400">Join the premium community today.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            icon={User} 
            type="text" 
            placeholder="Username" 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <Input 
            icon={Mail} 
            type="email" 
            placeholder="Email address" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input 
            icon={Lock} 
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <Button type="submit" fullWidth className="mt-6" disabled={loading}>
            {loading ? 'Creating Account...' : <>Sign Up <ArrowRight className="w-5 h-5 ml-2" /></>}
          </Button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
