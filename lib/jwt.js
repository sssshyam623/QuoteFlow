import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable in .env.local');
}

const secretKey = new TextEncoder().encode(JWT_SECRET);
const ALG = 'HS256';
const EXPIRES_IN = '7d'; // how long a login session lasts

// Creates a signed JWT containing the user's id/name/email.
// iat (issued-at) is set automatically by setIssuedAt(); we deliberately do
// NOT set a "not before" (nbf) claim, since that has caused clock-skew
// issues in the past — the token is valid immediately upon creation.
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(secretKey);
}

// Verifies a JWT and returns its payload, or null if invalid/expired.
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey, { algorithms: [ALG] });
    return payload;
  } catch {
    return null;
  }
}
