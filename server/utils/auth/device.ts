/**
 * Device and IP address utilities for authentication tracking
 */

import type { H3Event } from 'h3'
import { getHeader } from 'h3'

/**
 * Generate a unique device ID based on user agent and IP address
 * @param userAgent User agent string from request headers
 * @param ipAddress IP address of the client
 * @returns A unique device identifier
 */
export function generateDeviceId(userAgent: string = 'unknown', ipAddress?: string): string {
    const baseString = `${userAgent}:${ipAddress || 'unknown'}`

    // Create a simple hash of the base string
    let hash = 0
    for (let i = 0; i < baseString.length; i++) {
        const char = baseString.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
    }

    return `device_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`
}

/**
 * Extract client IP address from H3 event
 * @param event H3 event object
 * @returns Client IP address or undefined
 */
export function getClientIp(event: H3Event): string | undefined {
    // Check for forwarded headers first (reverse proxy, load balancer)
    const forwardedFor = getHeader(event, 'x-forwarded-for')
    if (forwardedFor) {
        // Take the first IP in the chain
        return forwardedFor.split(',')[0].trim()
    }

    // Check for real IP header
    const realIp = getHeader(event, 'x-real-ip')
    if (realIp) {
        return realIp
    }

    // Check for CF-Connecting-IP (Cloudflare)
    const cfIp = getHeader(event, 'cf-connecting-ip')
    if (cfIp) {
        return cfIp
    }

    // Fallback to remote address from event context
    const remoteAddress = event.node.req.socket?.remoteAddress
    if (remoteAddress) {
        return remoteAddress
    }

    return undefined
}

/**
 * Extract platform information from user agent string
 * @param userAgent User agent string
 * @returns Platform name
 */
export function getPlatformFromUserAgent(userAgent: string): string {
    const ua = userAgent.toLowerCase()

    if (ua.includes('windows')) return 'Windows'
    if (ua.includes('mac os x') || ua.includes('macintosh')) return 'macOS'
    if (ua.includes('linux')) return 'Linux'
    if (ua.includes('android')) return 'Android'
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS'
    if (ua.includes('chrome os')) return 'Chrome OS'

    return 'Unknown'
}

/**
 * Extract browser information from user agent string
 * @param userAgent User agent string
 * @returns Browser name and version
 */
export function getBrowserFromUserAgent(userAgent: string): { name: string; version?: string } {
    const ua = userAgent.toLowerCase()

    // Chrome
    const chromeMatch = ua.match(/chrome\/(\d+)/)
    if (chromeMatch && !ua.includes('edg')) {
        return { name: 'Chrome', version: chromeMatch[1] }
    }

    // Edge
    const edgeMatch = ua.match(/edg\/(\d+)/)
    if (edgeMatch) {
        return { name: 'Edge', version: edgeMatch[1] }
    }

    // Firefox
    const firefoxMatch = ua.match(/firefox\/(\d+)/)
    if (firefoxMatch) {
        return { name: 'Firefox', version: firefoxMatch[1] }
    }

    // Safari
    const safariMatch = ua.match(/version\/(\d+).*safari/)
    if (safariMatch) {
        return { name: 'Safari', version: safariMatch[1] }
    }

    return { name: 'Unknown' }
}
