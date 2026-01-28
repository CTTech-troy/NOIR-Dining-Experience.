/**
 * AES Encryption/Decryption Utilities for Secure VAPI Payload
 * Uses crypto-js library for client-side encryption
 */

import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const ENCRYPTION_IV = import.meta.env.VITE_ENCRYPTION_IV;

/**
 * Encrypt payload using AES-256-CBC
 * @param {Object} payload - Data to encrypt
 * @returns {Object} Encrypted data with hash and signature
 */
export const encryptPayload = (payload) => {
  try {
    const timestamp = Date.now();
    
    // Add timestamp to prevent replay attacks
    const dataWithTimestamp = {
      ...payload,
      _timestamp: timestamp,
      _version: '1.0'
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(dataWithTimestamp);

    // Generate salt for key derivation
    const salt = CryptoJS.lib.WordArray.random(128 / 8);

    // Derive encryption key using PBKDF2
    const derivedKey = CryptoJS.PBKDF2(ENCRYPTION_KEY, salt, {
      keySize: 256 / 32,
      iterations: 1000
    });

    // Create IV from predefined constant (in production, should be random per message)
    const iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_IV.padEnd(16, '0').slice(0, 16));

    // Encrypt using AES-256-CBC
    const encrypted = CryptoJS.AES.encrypt(jsonString, derivedKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Create HMAC signature for integrity verification
    const signature = CryptoJS.HmacSHA256(encrypted.toString(), ENCRYPTION_KEY).toString();

    // Return encrypted payload
    return {
      encrypted: encrypted.toString(),
      salt: salt.toString(),
      signature: signature,
      algorithm: 'AES-256-CBC',
      timestamp: timestamp,
      success: true
    };
  } catch (error) {
    console.error('❌ Encryption failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Decrypt payload using AES-256-CBC
 * @param {Object} encryptedData - Encrypted data object
 * @returns {Object} Decrypted payload
 */
export const decryptPayload = (encryptedData) => {
  try {
    const { encrypted, salt, signature } = encryptedData;

    // Verify HMAC signature
    const expectedSignature = CryptoJS.HmacSHA256(encrypted, ENCRYPTION_KEY).toString();
    if (signature !== expectedSignature) {
      console.warn('⚠️  Signature verification failed - Data may have been tampered with');
      return {
        success: false,
        error: 'Signature verification failed'
      };
    }

    // Reconstruct the salt
    const saltLib = CryptoJS.enc.Hex.parse(salt);

    // Derive the same key using PBKDF2
    const derivedKey = CryptoJS.PBKDF2(ENCRYPTION_KEY, saltLib, {
      keySize: 256 / 32,
      iterations: 1000
    });

    // Create IV
    const iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_IV.padEnd(16, '0').slice(0, 16));

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(encrypted, derivedKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Convert to UTF-8 string
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    const payload = JSON.parse(decryptedString);

    // Check timestamp to prevent replay attacks (5 minutes window)
    const now = Date.now();
    const age = now - payload._timestamp;
    if (age > 5 * 60 * 1000) {
      console.warn('⚠️  Payload expired - Possible replay attack');
      return {
        success: false,
        error: 'Payload has expired'
      };
    }

    // Remove internal fields before returning
    delete payload._timestamp;
    delete payload._version;

    return {
      success: true,
      data: payload
    };
  } catch (error) {
    console.error('❌ Decryption failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate a secure hash of the payload for integrity verification
 * @param {Object} payload - Data to hash
 * @returns {String} SHA-256 hash
 */
export const generatePayloadHash = (payload) => {
  const jsonString = JSON.stringify(payload);
  return CryptoJS.SHA256(jsonString).toString();
};

/**
 * Verify payload integrity
 * @param {Object} payload - Original payload
 * @param {String} hash - Hash to verify against
 * @returns {Boolean} True if hashes match
 */
export const verifyPayloadIntegrity = (payload, hash) => {
  const computedHash = generatePayloadHash(payload);
  return computedHash === hash;
};
