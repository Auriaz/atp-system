/**
 * Password hashing and verification utilities using Web Crypto API
 * This provides secure password hashing without external dependencies
 */

/**
 * Hash a password using PBKDF2 with SHA-256
 * @param password The plain text password to hash
 * @returns Promise resolving to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(16))

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    )

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    )

    const hashArray = new Uint8Array(derivedBits)
    const saltHex = Array.from(salt, byte => byte.toString(16).padStart(2, '0')).join('')
    const hashHex = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('')

    return `${saltHex}:${hashHex}`
}

/**
 * Verify a password against a hash
 * @param hash The stored password hash (salt:hash format)
 * @param password The plain text password to verify
 * @returns Promise resolving to true if password matches, false otherwise
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
        const [saltHex, storedHashHex] = hash.split(':')

        if (!saltHex || !storedHashHex) {
            return false
        }

        const encoder = new TextEncoder()
        const salt = new Uint8Array(
            saltHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
        )

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            'PBKDF2',
            false,
            ['deriveBits']
        )

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        )

        const hashArray = new Uint8Array(derivedBits)
        const computedHashHex = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('')

        return computedHashHex === storedHashHex
    } catch (error) {
        console.error('Password verification error:', error)
        return false
    }
}
