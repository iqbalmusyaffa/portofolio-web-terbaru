import crypto from 'crypto';

// Secret key for cryptographic signing and encryption (AES-256-GCM)
// A stable fallback key ensures existing admin sessions remain valid across server restarts/reloads.
const STABLE_DEFAULT_SECRET = 'portfolio_iqbal_jwt_secret_token_secure_2026_98ef1a72d';
const JWT_SECRET = (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 16)
  ? process.env.JWT_SECRET.trim()
  : STABLE_DEFAULT_SECRET;

// Derive a 256-bit (32 bytes) encryption key from the secret using SHA-256
const ENCRYPTION_KEY = crypto.createHash('sha256').update(JWT_SECRET).digest();

// ==================== IN-MEMORY RATE LIMITER ====================
// Tracks IP requests to prevent brute force and DDoS/spam
const rateLimitStore = new Map();

export function checkRateLimit(identifier, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitStore.get(identifier) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }

  rateLimitStore.set(identifier, record);

  return {
    allowed: record.count <= maxRequests,
    remaining: Math.max(0, maxRequests - record.count),
    resetInSeconds: Math.ceil((record.resetTime - now) / 1000)
  };
}

export function clearRateLimit(identifier) {
  rateLimitStore.delete(identifier);
}

// Clean up stale rate limit entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 30 * 60 * 1000);

// ==================== ENCRYPTED JWT (JWE - AES-256-GCM) ====================

/**
 * Creates an ENCRYPTED JWT (JWE) token using AES-256-GCM.
 * Unlike standard JWT (which is plain base64 text), JWE completely encrypts
 * the payload so the contents are confidential, tamper-proof, and cannot be read.
 * 
 * Token Structure: [12-byte IV].[16-byte AuthTag].[Encrypted Ciphertext] (base64url)
 */
export function createEncryptedToken(data, expiresInHours = 24) {
  // 1. Prepare payload with expiration & cryptographic nonce
  const payload = {
    ...data,
    iat: Date.now(),
    exp: Date.now() + expiresInHours * 60 * 60 * 1000,
    jti: crypto.randomBytes(16).toString('hex') // Unique token ID to prevent replay
  };

  // 2. Generate random 96-bit (12 bytes) Initialization Vector (IV) for AES-GCM
  const iv = crypto.randomBytes(12);

  // 3. Create AES-256-GCM Cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);

  // 4. Encrypt payload
  const jsonString = JSON.stringify(payload);
  const encrypted = Buffer.concat([
    cipher.update(jsonString, 'utf8'),
    cipher.final()
  ]);

  // 5. Get 128-bit authentication tag for integrity verification
  const authTag = cipher.getAuthTag();

  // 6. Return compact base64url format: iv.authTag.ciphertext
  return [
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url')
  ].join('.');
}

/**
 * Decrypts and verifies an AES-256-GCM Encrypted Token.
 * Returns the decoded payload if valid and not expired, or null if tampered with/expired.
 */
export function verifyEncryptedToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const [ivB64, authTagB64, ciphertextB64] = parts;

    const iv = Buffer.from(ivB64, 'base64url');
    const authTag = Buffer.from(authTagB64, 'base64url');
    const ciphertext = Buffer.from(ciphertextB64, 'base64url');

    // IV must be 12 bytes and AuthTag must be 16 bytes for AES-256-GCM
    if (iv.length !== 12 || authTag.length !== 16) return null;

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    // Decrypt ciphertext
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]);

    const payload = JSON.parse(decrypted.toString('utf8'));

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    // If auth tag doesn't match (tampering detected) or decryption fails, returns null
    return null;
  }
}

// Backward-compatible aliases
export function createSecureSessionToken(username, expiresInHours = 24) {
  return createEncryptedToken({ user: username }, expiresInHours);
}

export function verifySecureSessionToken(token) {
  return verifyEncryptedToken(token);
}

// ==================== PASSWORD SECURITY ====================

/**
 * Hashes password using PBKDF2 with salt.
 */
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies password against stored hash or fallback plain/env password with timing-safe comparison.
 */
export function verifyPassword(providedPassword, storedHashOrPlain) {
  if (!providedPassword || !storedHashOrPlain) return false;

  // If stored as salt:hash
  if (storedHashOrPlain.includes(':')) {
    const [salt, originalHash] = storedHashOrPlain.split(':');
    const computedHash = crypto.pbkdf2Sync(providedPassword, salt, 10000, 64, 'sha512').toString('hex');
    
    const originalBuf = Buffer.from(originalHash, 'hex');
    const computedBuf = Buffer.from(computedHash, 'hex');
    if (originalBuf.length !== computedBuf.length) return false;
    return crypto.timingSafeEqual(originalBuf, computedBuf);
  }

  // Fallback: direct string comparison with constant-time equality
  const a = Buffer.from(providedPassword);
  const b = Buffer.from(storedHashOrPlain);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ==================== INPUT SANITIZATION & VALIDATION ====================

/**
 * Strips potentially dangerous HTML tags and script injections to prevent XSS.
 */
export function sanitizeString(input, maxLength = 2000) {
  if (typeof input !== 'string') return '';

  return input
    .slice(0, maxLength)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Unescapes safe characters when needed for frontend rendering.
 */
export function unescapeString(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

/**
 * Validates email address format with strict regex.
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email) && email.length <= 150;
}

/**
 * Validates integer ID to prevent injection through URL params.
 */
export function parseValidId(id) {
  const num = parseInt(id, 10);
  if (isNaN(num) || num <= 0 || !Number.isInteger(num)) return null;
  return num;
}

// ==================== AUTH GUARD HELPER ====================

/**
 * Middleware function for Next.js Route Handlers to require valid admin authentication.
 */
export function requireAdminAuth(request) {
  const cookie = request.cookies.get('admin_auth');
  const token = cookie?.value;

  if (!token) {
    return {
      authenticated: false,
      response: { success: false, error: 'Akses ditolak: Anda belum terautentikasi' }
    };
  }

  const payload = verifyEncryptedToken(token);
  if (!payload || !payload.user) {
    return {
      authenticated: false,
      response: { success: false, error: 'Sesi login telah kedaluwarsa atau tidak valid' }
    };
  }

  return { authenticated: true, user: payload.user };
}

/**
 * Extracts client IP from request headers.
 */
export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}
