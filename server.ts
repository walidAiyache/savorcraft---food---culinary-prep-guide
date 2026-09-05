import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';

interface StoredUser {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'user';
    active: boolean;
    createdAt: string;
}

interface PublicUser extends Omit<StoredUser, 'passwordHash'> { }

const app = express();
const port = Number(process.env.PORT || 3000);
const usersFile = path.resolve('data/users.json');
const sessions = new Map<string, { userId: string; expiresAt: number }>();
const sessionMaxAge = 8 * 60 * 60 * 1000;

app.use(express.json({ limit: '100kb' }));

const toPublicUser = ({ passwordHash: _passwordHash, ...user }: StoredUser): PublicUser => user;
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const hashPassword = (password: string, salt = crypto.randomBytes(16).toString('hex')) =>
    `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
const verifyPassword = (password: string, storedHash: string) => {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const computed = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
};

const readUsers = async (): Promise<StoredUser[]> => {
    try {
        return JSON.parse(await fs.readFile(usersFile, 'utf8')) as StoredUser[];
    } catch {
        const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || 'walidyach788@gmail.com');
        const users: StoredUser[] = [{
            id: crypto.randomUUID(),
            name: 'Administrator',
            email: adminEmail,
            passwordHash: hashPassword(process.env.ADMIN_PASSWORD || 'admin2026'),
            role: 'admin',
            active: true,
            createdAt: new Date().toISOString(),
        }];
        await fs.mkdir(path.dirname(usersFile), { recursive: true });
        await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
        return users;
    }
};

const writeUsers = (users: StoredUser[]) => fs.writeFile(usersFile, JSON.stringify(users, null, 2));
const getCookie = (request: Request, name: string) => request.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
const setSessionCookie = (response: Response, token: string) => response.setHeader('Set-Cookie', `savorcraft_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAge / 1000}`);
const clearSessionCookie = (response: Response) => response.setHeader('Set-Cookie', 'savorcraft_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');

const requireAuth = async (request: Request, response: Response, next: NextFunction) => {
    const token = getCookie(request, 'savorcraft_session');
    const session = token ? sessions.get(token) : undefined;
    if (!session || session.expiresAt < Date.now()) {
        if (token) sessions.delete(token);
        return response.status(401).json({ error: 'Authentication required.' });
    }
    const user = (await readUsers()).find((candidate) => candidate.id === session.userId);
    if (!user || !user.active) return response.status(403).json({ error: 'This account is inactive.' });
    (request as Request & { user: StoredUser; token: string }).user = user;
    (request as Request & { user: StoredUser; token: string }).token = token!;
    next();
};

const requireAdmin = (request: Request, response: Response, next: NextFunction) => {
    if ((request as Request & { user: StoredUser }).user.role !== 'admin') return response.status(403).json({ error: 'Administrator access required.' });
    next();
};

app.post('/api/auth/register', async (request, response) => {
    const { name, email, password } = request.body as { name?: string; email?: string; password?: string };
    const normalizedEmail = normalizeEmail(email || '');
    if (!name?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || !password || password.length < 8) {
        return response.status(400).json({ error: 'Name, valid email, and an 8-character password are required.' });
    }
    const users = await readUsers();
    if (users.some((user) => user.email === normalizedEmail)) return response.status(409).json({ error: 'An account with this email already exists.' });
    const user: StoredUser = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, passwordHash: hashPassword(password), role: 'user', active: true, createdAt: new Date().toISOString() };
    users.push(user);
    await writeUsers(users);
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { userId: user.id, expiresAt: Date.now() + sessionMaxAge });
    setSessionCookie(response, token);
    response.status(201).json({ user: toPublicUser(user) });
});

app.post('/api/auth/login', async (request, response) => {
    const { email, password } = request.body as { email?: string; password?: string };
    const user = (await readUsers()).find((candidate) => candidate.email === normalizeEmail(email || ''));
    if (!user || !verifyPassword(password || '', user.passwordHash)) return response.status(401).json({ error: 'Invalid email or password.' });
    if (!user.active) return response.status(403).json({ error: 'This account has been disabled.' });
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { userId: user.id, expiresAt: Date.now() + sessionMaxAge });
    setSessionCookie(response, token);
    response.json({ user: toPublicUser(user) });
});

app.get('/api/auth/me', requireAuth, (request, response) => response.json({ user: toPublicUser((request as Request & { user: StoredUser }).user) }));
app.post('/api/auth/logout', requireAuth, (request, response) => {
    sessions.delete((request as Request & { token: string }).token);
    clearSessionCookie(response);
    response.status(204).end();
});

app.patch('/api/auth/account', requireAuth, async (request, response) => {
    const currentUser = (request as Request & { user: StoredUser }).user;
    const { name, email, password } = request.body as { name?: string; email?: string; password?: string };
    const normalizedEmail = email === undefined ? currentUser.email : normalizeEmail(email);
    if (name !== undefined && !name.trim()) return response.status(400).json({ error: 'Name cannot be empty.' });
    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return response.status(400).json({ error: 'Please enter a valid email.' });
    if (password !== undefined && password.length < 8) return response.status(400).json({ error: 'Password must contain at least 8 characters.' });
    const users = await readUsers();
    if (users.some((user) => user.id !== currentUser.id && user.email === normalizedEmail)) return response.status(409).json({ error: 'That email is already in use.' });
    const user = users.find((candidate) => candidate.id === currentUser.id);
    if (!user) return response.status(404).json({ error: 'User not found.' });
    if (name !== undefined) user.name = name.trim();
    if (email !== undefined) user.email = normalizedEmail;
    if (password !== undefined) user.passwordHash = hashPassword(password);
    await writeUsers(users);
    response.json({ user: toPublicUser(user) });
});

app.get('/api/users', requireAuth, requireAdmin, async (_request, response) => response.json({ users: (await readUsers()).map(toPublicUser) }));
app.patch('/api/users/:id', requireAuth, requireAdmin, async (request, response) => {
    const users = await readUsers();
    const user = users.find((candidate) => candidate.id === request.params.id);
    if (!user) return response.status(404).json({ error: 'User not found.' });
    const { active, role } = request.body as { active?: boolean; role?: 'admin' | 'user' };
    if (user.id === (request as Request & { user: StoredUser }).user.id && active === false) return response.status(400).json({ error: 'You cannot disable your own account.' });
    if (typeof active === 'boolean') user.active = active;
    if (role === 'admin' || role === 'user') user.role = role;
    await writeUsers(users);
    response.json({ user: toPublicUser(user) });
});
app.delete('/api/users/:id', requireAuth, requireAdmin, async (request, response) => {
    const currentUser = (request as Request & { user: StoredUser }).user;
    if (request.params.id === currentUser.id) return response.status(400).json({ error: 'You cannot delete your own account.' });
    const users = await readUsers();
    const nextUsers = users.filter((user) => user.id !== request.params.id);
    if (nextUsers.length === users.length) return response.status(404).json({ error: 'User not found.' });
    await writeUsers(nextUsers);
    response.status(204).end();
});

const start = async () => {
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.resolve('dist')));
        app.get('*', (_request, response) => response.sendFile(path.resolve('dist/index.html')));
    } else {
        const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
        app.use(vite.middlewares);
    }
    app.listen(port, () => console.log(`SavorCraft server running at http://localhost:${port}`));
};

start().catch((error) => { console.error(error); process.exit(1); });
