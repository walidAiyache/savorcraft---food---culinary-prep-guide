import React, { useState } from 'react';
import { Check, LogOut, UserRound } from 'lucide-react';
import { User } from '../types/auth';
import { authApi } from '../utils/api';

interface AccountSettingsProps {
  user: User;
  onUserUpdated: (user: User) => void;
  onLogout: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onUserUpdated, onLogout }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      const { user: updatedUser } = await authApi.updateAccount({
        name: name.trim(),
        email: email.trim(),
        ...(password ? { password } : {}),
      });
      onUserUpdated(updatedUser);
      setPassword('');
      setMessage('Account updated successfully.');
    } catch (accountError) {
      setError(accountError instanceof Error ? accountError.message : 'Unable to update your account.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#eadfd3] shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-[#f0e8dc] pb-5 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#c85a32] text-white flex items-center justify-center">
            <UserRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif-display text-3xl font-bold text-[#1e1a17]">My Account</h1>
            <p className="text-xs text-[#7e7164]">Manage your profile and sign-in details.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f]">
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required className="mt-1 w-full rounded-xl border border-[#ded5c8] px-3.5 py-2.5 text-sm font-normal normal-case tracking-normal" />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f]">
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1 w-full rounded-xl border border-[#ded5c8] px-3.5 py-2.5 text-sm font-normal normal-case tracking-normal" />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f]">
            New password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} placeholder="Leave blank to keep your password" className="mt-1 w-full rounded-xl border border-[#ded5c8] px-3.5 py-2.5 text-sm font-normal normal-case tracking-normal" />
          </label>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          {message && <p className="flex items-center gap-1.5 text-sm font-semibold text-green-700"><Check className="w-4 h-4" />{message}</p>}
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-[#c85a32] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#b04a25] disabled:opacity-60">{saving ? 'Saving...' : 'Save account changes'}</button>
            <button type="button" onClick={onLogout} className="flex items-center gap-2 rounded-xl border border-[#ded5c8] px-5 py-2.5 text-xs font-bold text-[#5a4d41] hover:bg-[#f4efe8]"><LogOut className="w-4 h-4" />Log out</button>
          </div>
        </form>
      </div>
    </section>
  );
};
