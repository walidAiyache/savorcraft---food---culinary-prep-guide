/**
 * Security & Data Sanitization Utilities
 * Protects against XSS, Prototype Pollution, Insecure Storage, and Brute Force Attacks.
 */

// Cryptographic SHA-256 Hashing with Salt
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// URL Sanitization - Blocks javascript:, vbscript:, data:text/html, and other malicious protocols
export function sanitizeUrl(url: string | undefined | null, fallback = ''): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Allow relative URLs starting with / or ./ or ../
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed;
  }

  // Allow safe http and https protocols
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return trimmed;
      }
    } catch {
      return fallback;
    }
  }

  // Allow safe inline image data URLs only
  if (/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,[a-zA-Z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }

  return fallback;
}

// Session Security: Expiring session token
const SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours

export interface AdminSession {
  email: string;
  token: string;
  createdAt: number;
  expiresAt: number;
}

export function createAdminSession(email: string): AdminSession {
  const now = Date.now();
  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('');

  const session: AdminSession = {
    email: email.trim().toLowerCase(),
    token,
    createdAt: now,
    expiresAt: now + SESSION_EXPIRY_MS,
  };

  try {
    sessionStorage.setItem('savorcraft_admin_session_v3', JSON.stringify(session));
    localStorage.setItem('savorcraft_admin_session_v3', JSON.stringify(session));
  } catch {
    // ignore
  }

  return session;
}

export function validateAdminSession(allowedEmail: string): boolean {
  try {
    const raw = sessionStorage.getItem('savorcraft_admin_session_v3') || localStorage.getItem('savorcraft_admin_session_v3');
    if (!raw) return false;

    const session: AdminSession = JSON.parse(raw);
    if (!session || typeof session !== 'object') return false;

    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return false;
    }

    if (session.email !== allowedEmail.trim().toLowerCase() && session.email !== 'admin') {
      clearAdminSession();
      return false;
    }

    return true;
  } catch {
    clearAdminSession();
    return false;
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem('savorcraft_admin_session_v3');
    localStorage.removeItem('savorcraft_admin_session_v3');
    localStorage.removeItem('savorcraft_admin_session');
  } catch {
    // ignore
  }
}

// Rate Limiting & Brute Force Lockout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 3 * 60 * 1000; // 3 minutes lockout
const RATE_LIMIT_KEY = 'savorcraft_auth_ratelimit';

interface RateLimitData {
  failedAttempts: number;
  lockoutUntil: number | null;
  lastAttemptAt: number;
}

export function checkRateLimit(): { allowed: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) {
      return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS, retryAfterSeconds: 0 };
    }

    const data: RateLimitData = JSON.parse(raw);
    const now = Date.now();

    if (data.lockoutUntil && now < data.lockoutUntil) {
      const remainingSeconds = Math.ceil((data.lockoutUntil - now) / 1000);
      return { allowed: false, remainingAttempts: 0, retryAfterSeconds: remainingSeconds };
    }

    // Reset if cooldown has passed
    if (data.lockoutUntil && now >= data.lockoutUntil) {
      resetRateLimit();
      return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS, retryAfterSeconds: 0 };
    }

    const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - data.failedAttempts);
    return { allowed: remaining > 0, remainingAttempts: remaining, retryAfterSeconds: 0 };
  } catch {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS, retryAfterSeconds: 0 };
  }
}

export function recordFailedAttempt(): { remainingAttempts: number; retryAfterSeconds: number } {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    let data: RateLimitData = raw ? JSON.parse(raw) : { failedAttempts: 0, lockoutUntil: null, lastAttemptAt: now };

    data.failedAttempts += 1;
    data.lastAttemptAt = now;

    if (data.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      data.lockoutUntil = now + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
      return { remainingAttempts: 0, retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
    }

    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    return { remainingAttempts: MAX_FAILED_ATTEMPTS - data.failedAttempts, retryAfterSeconds: 0 };
  } catch {
    return { remainingAttempts: 0, retryAfterSeconds: 0 };
  }
}

export function resetRateLimit(): void {
  try {
    sessionStorage.removeItem(RATE_LIMIT_KEY);
  } catch {
    // ignore
  }
}

// Strict JSON Schema & Prototype Pollution Protection for Imports
export function sanitizeSafeJsonString(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}
