'use client';

import { useState } from 'react';
import { submitRSVP, getRSVPByEmail } from '../actions/rsvp';

type ViewMode = 'lookup' | 'form' | 'success';

export default function RSVPForm() {
  const [viewMode, setViewMode] = useState<ViewMode>('lookup');
  const [lookupEmail, setLookupEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    numberOfGuests: '1',
    attending: true,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const result = await getRSVPByEmail(lookupEmail);

      if (result.success && result.rsvp) {
        // Found existing RSVP - populate form
        setFormData({
          name: result.rsvp.name,
          email: result.rsvp.email,
          numberOfGuests: result.rsvp.numberOfGuests.toString(),
          attending: result.rsvp.attending,
        });
        setIsEditing(true);
        setViewMode('form');
        setStatus('idle');
      } else {
        // No RSVP found - show error
        setStatus('error');
        setMessage(result.error || 'No RSVP found for this email address');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

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
        setViewMode('success');
      } else {
        setStatus('error');
        setMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', numberOfGuests: '1', attending: true });
    setLookupEmail('');
    setIsEditing(false);
    setStatus('idle');
    setMessage('');
    setViewMode('lookup');
  };

  const startNewRSVP = () => {
    setFormData({ name: '', email: '', numberOfGuests: '1', attending: true });
    setIsEditing(false);
    setStatus('idle');
    setMessage('');
    setViewMode('form');
  };

  // Success view
  if (viewMode === 'success') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 border border-white/20 rounded-sm p-8 text-center">
          <p className="text-white text-lg font-light mb-6">{message}</p>
          <button
            onClick={resetForm}
            className="text-gray-400 hover:text-white text-sm tracking-wide transition-colors"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  // Lookup view
  if (viewMode === 'lookup') {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="text-white/80 text-sm font-light mb-6">
            Check your RSVP status or submit a new response
          </p>
        </div>

        <form onSubmit={handleLookup} className="space-y-6">
          <div>
            <input
              type="email"
              required
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/20 focus:border-white text-white placeholder:text-gray-500 outline-none transition-colors font-light"
              placeholder="Enter your email address"
            />
          </div>

          {status === 'error' && (
            <div className="border border-red-400/30 bg-red-400/10 rounded-sm p-4 text-red-300 text-sm font-light">
              {message}
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-white text-black py-4 font-light tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Looking up...' : 'Check RSVP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={startNewRSVP}
                className="text-gray-400 hover:text-white text-sm tracking-wide transition-colors"
              >
                Submit new RSVP
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Form view (new RSVP or editing)
  return (
    <div className="max-w-md mx-auto">
      {isEditing && (
        <div className="bg-white/10 border border-white/20 rounded-sm p-4 mb-6 text-center">
          <p className="text-white/90 text-sm font-light">
            Editing RSVP for <span className="font-normal">{formData.email}</span>
          </p>
        </div>
      )}

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
            disabled={isEditing}
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

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-white text-black py-4 font-light tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Submitting...' : isEditing ? 'Update RSVP' : 'Submit'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-white text-sm tracking-wide transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
