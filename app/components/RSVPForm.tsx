'use client';

import { useState } from 'react';
import { submitRSVP, getRSVPByEmail } from '../actions/rsvp';

type ViewMode = 'lookup' | 'view' | 'form' | 'success';

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

      // Check if they actually submitted an RSVP (has a name) vs just checked
      if (result.success && result.rsvp && result.rsvp.name) {
        // Found real RSVP - show view mode
        setFormData({
          name: result.rsvp.name,
          email: result.rsvp.email,
          numberOfGuests: result.rsvp.numberOfGuests.toString(),
          attending: result.rsvp.attending,
        });
        setIsEditing(true);
        setViewMode('view');
        setStatus('idle');
      } else {
        // No RSVP found (or only check-only record) - show form with email pre-filled
        setFormData({
          name: '',
          email: lookupEmail,
          numberOfGuests: '1',
          attending: true,
        });
        setIsEditing(false);
        setViewMode('form');
        setStatus('idle');
        setMessage('');
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

  const startEditing = () => {
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

  // View mode - Display existing RSVP
  if (viewMode === 'view') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 border border-white/20 rounded-sm p-8">
          <h3 className="text-white text-lg font-light mb-6 text-center">Your RSVP</h3>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Name</p>
              <p className="text-white font-light">{formData.name}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Email</p>
              <p className="text-white font-light">{formData.email}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Status</p>
              {formData.attending ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-300">
                    Attending
                  </span>
                  <span className="text-white font-light">
                    {formData.numberOfGuests === '1' ? 'Just you' : formData.numberOfGuests === '2' ? '+1' : '+2'}
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-400/20 text-red-300">
                  Not Attending
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startEditing}
              className="w-full bg-white text-black py-4 font-light tracking-wide hover:bg-gray-100 transition-colors"
            >
              Edit RSVP
            </button>

            <div className="text-center">
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white text-sm tracking-wide transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form view (new RSVP or editing)
  return (
    <div className="max-w-md mx-auto">
      {!isEditing && (
        <div className="bg-blue-400/10 border border-blue-400/30 rounded-sm p-4 mb-6 text-center">
          <p className="text-blue-300 text-sm font-light">
            You haven't submitted an RSVP yet. Please fill out the form below.
          </p>
        </div>
      )}

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
              <option value="1" className="bg-gray-900">Just me</option>
              <option value="2" className="bg-gray-900">+1</option>
              <option value="3" className="bg-gray-900">+2</option>
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
