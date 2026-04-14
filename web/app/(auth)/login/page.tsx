'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { authApi } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setAuth(data.user, data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full p-8 bg-white rounded-lg shadow'>
        <h2 className='text-center text-3xl font-bold mb-6'>SaaS Church</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && <div className='bg-red-50 text-red-600 p-3 rounded'>{error}</div>}
          <input type='email' required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='w-full px-3 py-2 border rounded' />
          <input type='password' required value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='w-full px-3 py-2 border rounded' />
          <button type='submit' disabled={loading} className='w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
}
