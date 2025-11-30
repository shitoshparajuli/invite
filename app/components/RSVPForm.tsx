'use client';

import { useState } from 'react';
import { submitRSVP } from '../actions/rsvp';

export default function RSVPForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    numberOfGuests: '1',
    attending: true,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const result = await submitRSVP({
        name: formData.name,
        email: formData.email,
        numberOfGuests: parseInt(formData.numberOfGuests),
        attending: formData.attending,
        submittedAt: new Date().toISOString(),
      });

      if (result.success) {
        setStatus('success');
        setMessage(formData.attending
          ? 'Thank you. We look forward to celebrating with you.'
          : 'Thank you for letting us know.');
        setFormData({ name: '', email: '', numberOfGuests: '1', attending: true });
      } else {
        setStatus('error');
        setMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {status === 'success' ? (
        <div className="bg-white/10 border border-white/20 rounded-sm p-8 text-center">
          <p className="text-white text-lg font-light mb-6">{message}</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-gray-400 hover:text-white text-sm tracking-wide transition-colors"
          >
            Submit another response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Attending Radio Buttons */}
          <div className="space-y-4">
            <div className="flex gap-6 justify-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="attending"
                  checked={formData.attending}
                  onChange={() => setFormData({ ...formData, attending: true })}
                  className="w-4 h-4 border-white/30 bg-transparent text-white focus:ring-white/50"
                />
                <span className="text-white font-light group-hover:text-gray-300 transition-colors">
                  Attending
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="attending"
                  checked={!formData.attending}
                  onChange={() => setFormData({ ...formData, attending: false })}
                  className="w-4 h-4 border-white/30 bg-transparent text-white focus:ring-white/50"
                />
                <span className="text-white font-light group-hover:text-gray-300 transition-colors">
                  Decline
                </span>
              </label>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 focus:border-white text-white placeholder:text-gray-500 outline-none transition-colors font-light"
              placeholder="Full Name"
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 focus:border-white text-white placeholder:text-gray-500 outline-none transition-colors font-light"
              placeholder="Email Address"
            />
          </div>

          {/* Number of Guests */}
          {formData.attending && (
            <div>
              <select
                id="guests"
                value={formData.numberOfGuests}
                onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 focus:border-white text-white outline-none transition-colors font-light appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} className="bg-gray-900">
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="border border-red-400/30 bg-red-400/10 rounded-sm p-4 text-red-300 text-sm font-light">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-white text-black py-4 mt-8 font-light tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
}
