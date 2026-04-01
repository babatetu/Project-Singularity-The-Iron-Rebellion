
/**
 * SECURITY UTILITY: OBFUSCATION LAYER
 * 
 * NOTE: In client-side applications, true encryption is impossible because the 
 * decryption key must also be on the client. This utility provides an 
 * obfuscation layer to prevent "plain-text" scraping of keys from the source code.
 * 
 * For TRUE security:
 * 1. Use Environment Variables (Settings > Secrets)
 * 2. Configure Firebase Security Rules (firestore.rules)
 */

/**
 * Simple Base64 deobfuscation
 */
export const deobfuscate = (encoded: string): string => {
  if (!encoded) return "";
  try {
    // Check if it looks like it might be Base64
    // (Simple check: no spaces, specific chars, but we'll just try atob)
    return atob(encoded);
  } catch (e) {
    // If it's not Base64, it might be the plain key
    return encoded;
  }
};

/**
 * Simple Base64 obfuscation
 */
export const obfuscate = (text: string): string => {
  if (!text) return "";
  try {
    return btoa(text);
  } catch (e) {
    return text;
  }
};
