import { User } from '../types/auth';
import { isSupabaseConfigured, supabase } from './supabase';

// Throws a clear configuration error if Supabase env vars are missing.
// The frontend MUST use Supabase Auth directly — no local API server.
const requireSupabase = () => {
    if (!isSupabaseConfigured || !supabase) {
        throw new Error(
            'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env (or .env.local), then run `npm run build` again.'
        );
    }
    return supabase;
};

// Map a Supabase profile row to the local User shape.
const toUser = (profile: {
    id: string;
    name: string | null;
    email: string | null;
    role: string | null;
    active: boolean | null;
    created_at: string | null;
}): User => ({
    id: profile.id,
    name: profile.name ?? '',
    email: profile.email ?? '',
    role: (profile.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
    active: profile.active ?? true,
    createdAt: profile.created_at ?? new Date().toISOString(),
});

// Translate Supabase error messages into friendlier UI text.
const friendlyAuthError = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes('user already registered') || lower.includes('already been registered')) {
        return 'An account with this email already exists. Try signing in instead.';
    }
    if (lower.includes('invalid login') || lower.includes('invalid credentials') || lower.includes('invalid email or password')) {
        return 'Incorrect email or password.';
    }
    if (lower.includes('email not confirmed')) {
        return 'Please confirm your email before signing in. Check your inbox for the verification link.';
    }
    if (lower.includes('password should be')) {
        return 'Password is too weak. Use at least 8 characters.';
    }
    if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit')) {
        return 'Too many requests. Please wait a moment and try again.';
    }
    if (lower.includes('network') || lower.includes('fetch')) {
        return 'Network error. Check your connection and try again.';
    }
    return message;
};

export const authApi = {
    signInWithProvider: async (provider: 'google' | 'facebook' | 'apple') => {
        const client = requireSupabase();
        const { error } = await client.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin },
        });
        if (error) throw new Error(friendlyAuthError(error.message));
    },

    me: async () => {
        const client = requireSupabase();
        const { data: { user }, error } = await client.auth.getUser();
        if (error || !user) throw new Error('You are not signed in.');
        const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('id, name, email, role, active, created_at')
            .eq('id', user.id)
            .single();
        if (profileError) throw new Error(friendlyAuthError(profileError.message));
        return { user: toUser(profile) };
    },

    login: async (email: string, password: string) => {
        const client = requireSupabase();
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error || !data.user) throw new Error(friendlyAuthError(error?.message || 'Invalid email or password.'));
        return authApi.me();
    },
    

    register: async (name: string, email: string, password: string) => {
        const client = requireSupabase();
        const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
                data: { name },
                emailRedirectTo: window.location.origin,
            },
        });
        if (error) throw new Error(friendlyAuthError(error.message));
        if (!data.user) throw new Error('Unable to create account. Please try again.');

        // If Supabase is configured to require email confirmation, no session
        // is returned until the user verifies their email.
        if (!data.session) {
            throw new Error('Account created. Confirm your email, then sign in.');
        }

        return authApi.me();
    },

    logout: async () => {
        const client = requireSupabase();
        const { error } = await client.auth.signOut();
        if (error) throw new Error(friendlyAuthError(error.message));
    },

    updateAccount: async (changes: { name?: string; email?: string; password?: string }) => {
        const client = requireSupabase();
        if (changes.email || changes.password) {
            const { error } = await client.auth.updateUser({
                ...(changes.email ? { email: changes.email } : {}),
                ...(changes.password ? { password: changes.password } : {}),
            });
            if (error) throw new Error(friendlyAuthError(error.message));
        }
        if (changes.name) {
            const { data: { user } } = await client.auth.getUser();
            if (!user) throw new Error('You are not signed in.');
            const { error } = await client
                .from('profiles')
                .update({ name: changes.name })
                .eq('id', user.id);
            if (error) throw new Error(friendlyAuthError(error.message));
        }
        return authApi.me();
    },
};

export const usersApi = {
    list: async () => {
        const client = requireSupabase();
        const { data, error } = await client
            .from('profiles')
            .select('id, name, email, role, active, created_at')
            .order('created_at', { ascending: false });
        if (error) throw new Error(friendlyAuthError(error.message));
        return { users: (data || []).map(toUser) };
    },

    update: async (id: string, changes: Partial<Pick<User, 'active' | 'role'>>) => {
        const client = requireSupabase();
        const { data, error } = await client
            .from('profiles')
            .update(changes)
            .eq('id', id)
            .select('id, name, email, role, active, created_at')
            .single();
        if (error) throw new Error(friendlyAuthError(error.message));
        return { user: toUser(data) };
    },
    

    remove: async (id: string) => {
        const client = requireSupabase();
        const { error } = await client.from('profiles').delete().eq('id', id);
        if (error) throw new Error(friendlyAuthError(error.message));
    },
};