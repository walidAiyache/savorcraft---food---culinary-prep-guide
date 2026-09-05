import { User } from '../types/auth';
import { isSupabaseConfigured, supabase } from './supabase';

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: { 'Content-Type': 'application/json', ...options?.headers },
            credentials: 'include',
        });
        const body = response.status === 204 ? null : await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.error || `Request failed (${response.status}).`);
        return body as T;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Authentication service is unavailable. Configure Supabase and rebuild the site before deploying it.');
        }
        throw error;
    }
};

export const authApi = {
    signInWithProvider: async (provider: 'google' | 'facebook' | 'apple') => {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Social sign-in requires Supabase configuration.');
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin },
        });
        if (error) throw new Error(error.message);
    },
    me: async () => {
        if (isSupabaseConfigured && supabase) {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) throw new Error('Authentication required.');
            const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profileError) throw new Error(profileError.message);
            return { user: { id: profile.id, name: profile.name, email: profile.email, role: profile.role, active: profile.active, createdAt: profile.created_at } as User };
        }
        return request<{ user: User }>('/api/auth/me');
    },
    login: async (email: string, password: string) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error || !data.user) throw new Error(error?.message || 'Invalid email or password.');
            return authApi.me();
        }
        return request<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    },
    register: async (name: string, email: string, password: string) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
            if (error || !data.user) throw new Error(error?.message || 'Unable to create account.');
            if (!data.session) throw new Error('Account created. Confirm your email, then sign in.');
            return authApi.me();
        }
        return request<{ user: User }>('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    },
    logout: async () => {
        if (isSupabaseConfigured && supabase) {
            const { error } = await supabase.auth.signOut();
            if (error) throw new Error(error.message);
            return;
        }
        return request<void>('/api/auth/logout', { method: 'POST' });
    },
    updateAccount: async (changes: { name?: string; email?: string; password?: string }) => {
        if (isSupabaseConfigured && supabase) {
            if (changes.email || changes.password) {
                const { error } = await supabase.auth.updateUser({
                    ...(changes.email ? { email: changes.email } : {}),
                    ...(changes.password ? { password: changes.password } : {}),
                });
                if (error) throw new Error(error.message);
            }
            if (changes.name) {
                const { data: { user } } = await supabase.auth.getUser();
                const { error } = await supabase.from('profiles').update({ name: changes.name }).eq('id', user?.id);
                if (error) throw new Error(error.message);
            }
            return authApi.me();
        }
        return request<{ user: User }>('/api/auth/account', { method: 'PATCH', body: JSON.stringify(changes) });
    },
};

export const usersApi = {
    list: async () => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return { users: (data || []).map((profile) => ({ id: profile.id, name: profile.name, email: profile.email, role: profile.role, active: profile.active, createdAt: profile.created_at } as User)) };
        }
        return request<{ users: User[] }>('/api/users');
    },
    update: async (id: string, changes: Partial<Pick<User, 'active' | 'role'>>) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.from('profiles').update(changes).eq('id', id).select('*').single();
            if (error) throw new Error(error.message);
            return { user: { id: data.id, name: data.name, email: data.email, role: data.role, active: data.active, createdAt: data.created_at } as User };
        }
        return request<{ user: User }>(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });
    },
    remove: async (id: string) => {
        if (isSupabaseConfigured && supabase) {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) throw new Error(error.message);
            return;
        }
        return request<void>(`/api/users/${id}`, { method: 'DELETE' });
    },
};
