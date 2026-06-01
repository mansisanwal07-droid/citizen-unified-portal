import React, { useState } from 'react';

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP Verification
  const [role, setRole] = useState('Citizen');
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    // Simulate API call to send OTP / Verify credentials
    setStep(2);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    // Simulate JWT Token reception and route redirection based on role
    alert(`Logged in successfully as ${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">GRUS Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Governance Real-time Update System</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Select Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
              >
                <option>Citizen</option>
                <option>Officer</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
              <input type="email" required className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
              <input type="password" required className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-slate-500" />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded text-sm font-medium hover:bg-slate-800 transition">
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
            <div className="text-center mt-4">
              <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-xs text-slate-600 underline">
                {isSignup ? 'Already have an account? Log in' : 'Need an account? Register'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <p className="text-sm text-slate-600 text-center">A verification code has been sent to your registered device.</p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Enter OTP</label>
              <input 
                type="text" 
                maxLength="6" 
                required 
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm tracking-widest text-center font-mono focus:outline-none" 
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded text-sm font-medium hover:bg-slate-800 transition">
              Verify & Proceed
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-slate-500 text-center block mt-2">
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
    }
