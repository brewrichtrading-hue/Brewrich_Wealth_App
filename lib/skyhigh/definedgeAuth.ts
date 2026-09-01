/**
 * BREWRICH SKY HIGH - DEFINEDGE 2FA AUTHENTICATION SERVICE (PHASE 4A)
 * 
 * Implements the official Definedge Securities 2-Factor Authentication Flow:
 * - Step 1: GET https://signin.definedgesecurities.com/auth/realms/debroking/dsbpkc/login/{{api_token}}
 *           Header: api_secret: {{api_secret}}
 *           Returns otp_token and dispatches 2FA OTP to user.
 * - Step 2: POST https://signin.definedgesecurities.com/auth/realms/debroking/dsbpkc/token
 *           Submits { otp_token, otp } and returns api_session_key.
 * 
 * Strict Security Principles:
 * - Credentials and session keys are NEVER exposed to client JavaScript or browser logs.
 * - Never stored in Supabase or browser storage.
 * - Server-side stateless encryption for HttpOnly cookie persistence.
 */

import https from 'https';
import crypto from 'crypto';

export interface Step1Request {
  apiToken?: string;
  apiSecret?: string;
}

export interface Step1Response {
  success: boolean;
  otpToken: string;
  message: string;
}

export interface Step2Request {
  otpToken: string;
  otp: string;
}

export interface Step2Response {
  success: boolean;
  username: string;
  cookieToken: string;
  message: string;
}

interface InMemSession {
  sessionKey: string | null;
  username: string | null;
  authenticatedAt: number | null;
}

// In-memory session store (active for the duration of the server process)
const inMemSession: InMemSession = {
  sessionKey: null,
  username: null,
  authenticatedAt: null,
};

// Derive a stable 32-byte encryption key from server environment
function getEncryptionKey(): Buffer {
  const secret = 
    process.env.DEFINEDGE_ENCRYPTION_SECRET || 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    'brewrich_skyhigh_definedge_secure_salt_2026';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts the api_session_key into an opaque, tamper-proof token for HttpOnly cookie.
 */
export function encryptSessionKey(sessionKey: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(sessionKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // Format: ivHex:authTagHex:encryptedDataHex
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts the session key from the HttpOnly cookie token.
 */
export function decryptSessionKey(token: string): string | null {
  try {
    const parts = token.split(':');
    if (parts.length !== 3) return null;

    const [ivHex, authTagHex, encryptedDataHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedDataHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return null;
  }
}

/**
 * Step 1: Initiates Definedge User Login & triggers OTP dispatch.
 */
export function requestDefinedgeOtp(params: Step1Request): Promise<Step1Response> {
  const apiToken = params.apiToken?.trim() || process.env.DEFINEDGE_API_TOKEN?.trim();
  const apiSecret = params.apiSecret?.trim() || process.env.DEFINEDGE_API_SECRET?.trim();

  if (!apiToken || !apiSecret) {
    return Promise.reject(
      new Error('Definedge API Token and API Secret are required. Please provide them or set DEFINEDGE_API_TOKEN / DEFINEDGE_API_SECRET in environment.')
    );
  }

  return new Promise((resolve, reject) => {
    const path = `/auth/realms/debroking/dsbpkc/login/${encodeURIComponent(apiToken)}`;
    const options: https.RequestOptions = {
      hostname: 'signin.definedgesecurities.com',
      port: 443,
      path,
      method: 'GET',
      headers: {
        'api_secret': apiSecret,
        'Accept': 'application/json',
        'User-Agent': 'BrewrichSkyHighAuth/1.0',
      },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json: any = {};
        try {
          json = JSON.parse(data);
        } catch {
          // Non-JSON response
        }

        if (res.statusCode === 401 || res.statusCode === 403) {
          return reject(new Error('Definedge Authentication Failed: Invalid API Token or API Secret. Please check your credentials from Definedge MyAccount -> API Config.'));
        }

        if (res.statusCode !== 200) {
          const desc = json.error_description || json.error || json.message || 'Invalid login request';
          if (desc.toLowerCase().includes('ip')) {
            return reject(new Error('Definedge Error: Request rejected due to registered-IP restrictions. Please check your IP binding in Definedge MyAccount.'));
          }
          return reject(new Error(`Definedge Login Step 1 Failed (HTTP ${res.statusCode}): ${desc}`));
        }

        if (!json.otp_token) {
          return reject(new Error('Definedge did not return an otp_token. Please verify your credentials and try again.'));
        }

        resolve({
          success: true,
          otpToken: json.otp_token,
          message: json.message || 'OTP has been dispatched to your registered mobile number and email address.',
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Definedge Login Step 1 request timed out (15s).'));
    });

    req.on('error', (err) => {
      reject(new Error(`Connection to Definedge authentication server failed: ${err.message}`));
    });

    req.end();
  });
}

/**
 * Step 2: Verifies 2FA OTP and retrieves api_session_key.
 */
export function verifyDefinedgeOtp(params: Step2Request): Promise<Step2Response> {
  const { otpToken, otp } = params;

  if (!otpToken || !otpToken.trim()) {
    return Promise.reject(new Error('Missing otp_token. Please request a new OTP first.'));
  }
  if (!otp || !otp.trim()) {
    return Promise.reject(new Error('Please enter the 6-digit OTP received on your mobile or email.'));
  }

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      otp_token: otpToken.trim(),
      otp: otp.trim(),
    });

    const options: https.RequestOptions = {
      hostname: 'signin.definedgesecurities.com',
      port: 443,
      path: '/auth/realms/debroking/dsbpkc/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/json',
        'User-Agent': 'BrewrichSkyHighAuth/1.0',
      },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json: any = {};
        try {
          json = JSON.parse(data);
        } catch {
          // Non-JSON response
        }

        if (res.statusCode !== 200 || !json.api_session_key) {
          const desc = json.error_description || json.error || json.message || 'OTP verification failed';
          return reject(new Error(`Definedge 2FA Verification Failed (HTTP ${res.statusCode}): ${desc}`));
        }

        const sessionKey = json.api_session_key;
        const username = json.uname || json.uid || 'Definedge User';

        // Store in server memory
        inMemSession.sessionKey = sessionKey;
        inMemSession.username = username;
        inMemSession.authenticatedAt = Date.now();

        // Encrypt for stateless HttpOnly cookie
        const cookieToken = encryptSessionKey(sessionKey);

        resolve({
          success: true,
          username,
          cookieToken,
          message: 'Definedge 2-Factor Authentication successful. Active session established.',
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Definedge 2FA verification timed out (15s).'));
    });

    req.on('error', (err) => {
      reject(new Error(`Connection to Definedge token server failed: ${err.message}`));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Retrieves the currently active api_session_key from server memory, encrypted cookie, or env.
 */
export function getActiveServerSessionKey(cookieValue?: string): string | null {
  // 1. In-memory session key
  if (inMemSession.sessionKey) {
    return inMemSession.sessionKey;
  }

  // 2. Decrypt from HttpOnly cookie
  if (cookieValue) {
    const decrypted = decryptSessionKey(cookieValue);
    if (decrypted) {
      inMemSession.sessionKey = decrypted;
      return decrypted;
    }
  }

  // 3. Server environment variable
  if (process.env.DEFINEDGE_API_SESSION_KEY?.trim()) {
    return process.env.DEFINEDGE_API_SESSION_KEY.trim();
  }

  return null;
}

/**
 * Clears the active server-side authentication session.
 */
export function clearServerSession(): void {
  inMemSession.sessionKey = null;
  inMemSession.username = null;
  inMemSession.authenticatedAt = null;
}

/**
 * Checks whether an active Definedge session is available.
 */
export function checkServerSessionStatus(cookieValue?: string): {
  isAuthenticated: boolean;
  username: string | null;
  hasEnvCredentials: boolean;
  hasEnvSessionKey: boolean;
} {
  const activeKey = getActiveServerSessionKey(cookieValue);
  const hasEnvCredentials = Boolean(
    process.env.DEFINEDGE_API_TOKEN?.trim() && 
    process.env.DEFINEDGE_API_SECRET?.trim()
  );
  const hasEnvSessionKey = Boolean(process.env.DEFINEDGE_API_SESSION_KEY?.trim());

  return {
    isAuthenticated: Boolean(activeKey),
    username: inMemSession.username,
    hasEnvCredentials,
    hasEnvSessionKey,
  };
}
