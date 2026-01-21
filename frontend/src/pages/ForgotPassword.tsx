import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call API endpoint for password reset (implement backend route)
    // await fetch('/api/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      {sent ? (
        <div className="p-4 bg-green-100 text-green-800 rounded">Check your email for reset instructions.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        </form>
      )}
    </div>
  );
}
