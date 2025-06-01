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
 * @returns Client IP address or null
 */
export function getClientIp(event: H3Event): string | null {
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

    return null
}

/**
 * Extract platform information from user agent string
 * @param userAgent User agent string
 * @returns Platform information object
 */
export function getPlatformFromUserAgent(userAgent?: string): Record<string, string | boolean> {
    if (!userAgent) return { unknown: true }

    const ua = userAgent.toLowerCase()
    const platformInfo: Record<string, string | boolean> = {
        mobile: false,
        tablet: false,
        desktop: true,
        os: 'unknown',
        browser: 'unknown',
        browserVersion: 'unknown'
    }

    // Detect device type
    if (/(android|webos|iphone|ipod|blackberry|iemobile|opera mini)/i.test(ua)) {
        platformInfo.mobile = true
        platformInfo.desktop = false
    } else if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
        platformInfo.tablet = true
        platformInfo.desktop = false
    }

    // Detect operating system
    if (/windows/i.test(ua)) {
        platformInfo.os = 'Windows'
    } else if (/macintosh|mac os x/i.test(ua)) {
        platformInfo.os = 'macOS'
    } else if (/linux/i.test(ua)) {
        platformInfo.os = 'Linux'
    } else if (/android/i.test(ua)) {
        platformInfo.os = 'Android'
    } else if (/iphone|ipad|ipod/i.test(ua)) {
        platformInfo.os = 'iOS'
    }

    // Detect browser
    if (/edge|edg/i.test(ua)) {
        platformInfo.browser = 'Edge'
        const match = ua.match(/(edge|edg)\/([\d.]+)/)
        if (match) platformInfo.browserVersion = match[2]
    } else if (/firefox/i.test(ua)) {
        platformInfo.browser = 'Firefox'
        const match = ua.match(/firefox\/([\d.]+)/)
        if (match) platformInfo.browserVersion = match[1]
    } else if (/chrome/i.test(ua)) {
        platformInfo.browser = 'Chrome'
        const match = ua.match(/chrome\/([\d.]+)/)
        if (match) platformInfo.browserVersion = match[1]
    } else if (/safari/i.test(ua)) {
        platformInfo.browser = 'Safari'
        const match = ua.match(/version\/([\d.]+)/)
        if (match) platformInfo.browserVersion = match[1]
    } else if (/msie|trident/i.test(ua)) {
        platformInfo.browser = 'Internet Explorer'
        const match = ua.match(/(msie |rv:)([\d.]+)/)
        if (match) platformInfo.browserVersion = match[2]
    }

    return platformInfo
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
