import React, { useEffect, useState } from 'react';
import { Shield, UserRound, UserX, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { User } from '../types/auth';
import { usersApi } from '../utils/api';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            setUsers((await usersApi.list()).users);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void loadUsers(); }, []);

    const updateUser = async (id: string, changes: Partial<Pick<User, 'active' | 'role'>>) => {
        try {
            const updated = await usersApi.update(id, changes);
            setUsers((current) => current.map((user) => user.id === id ? updated.user : user));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to update user.');
        }
    };

    const changeUserRole = (user: User) => {
        const nextRole = user.role === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Change ${user.email} role from ${user.role} to ${nextRole}?`)) return;
        void updateUser(user.id, { role: nextRole });
    };

    const removeUser = async (user: User) => {
        if (!window.confirm(`Delete ${user.email}?`)) return;
        try {
            await usersApi.remove(user.id);
            setUsers((current) => current.filter((candidate) => candidate.id !== user.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to delete user.');
        }
    };

    return (
        <div className="space-y-5 animate-fadeIn">
            <div className="bg-white p-5 rounded-2xl border border-[#ebd8c8] shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#faefe5] text-[#c85a32] flex items-center justify-center"><UserRound className="w-5 h-5" /></div>
                    <div><h2 className="font-serif-display text-xl font-bold text-[#1f1a16]">User management</h2><p className="text-xs text-[#7d7064]">Manage registered accounts, roles, and access.</p></div>
                </div>
            </div>
            {error && <div className="p-3 rounded-xl text-xs bg-red-50 text-red-800 border border-red-200 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
            <div className="bg-white rounded-2xl border border-[#ebd8c8] overflow-hidden shadow-xs">
                {loading ? <p className="p-6 text-sm text-[#7d7064]">Loading users...</p> : users.length === 0 ? <p className="p-6 text-sm text-[#7d7064]">No users found.</p> : (
                    <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-[#faf6f1] border-b border-[#ebd8c8] text-[#786b5e] uppercase tracking-wider"><tr><th className="py-3 px-4">User</th><th className="py-3 px-3">Role</th><th className="py-3 px-3">Status</th><th className="py-3 px-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#f2ebe1]">{users.map((user) => <tr key={user.id}><td className="py-3 px-4"><div className="font-semibold text-[#1f1a16]">{user.name}</div><div className="text-[#827467]">{user.email}</div></td><td className="py-3 px-3"><button onClick={() => changeUserRole(user)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f3ece3] text-[#6d6052] font-semibold"><Shield className="w-3 h-3" />{user.role}</button></td><td className="py-3 px-3"><span className={`inline-flex items-center gap-1 font-semibold ${user.active ? 'text-green-700' : 'text-red-700'}`}>{user.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}{user.active ? 'Active' : 'Disabled'}</span></td><td className="py-3 px-4 text-right"><div className="flex justify-end gap-1"><button onClick={() => void updateUser(user.id, { active: !user.active })} className="px-2.5 py-1.5 rounded-lg border border-[#ded5c8] text-[#6b5f54]">{user.active ? 'Disable' : 'Enable'}</button><button onClick={() => void removeUser(user)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" title="Delete user"><Trash2 className="w-4 h-4" /></button></div></td></tr>)}</tbody></table></div>
                )}
            </div>
        </div>
    );
};
