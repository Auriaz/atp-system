// import { H3Event } from 'h3';

// /**
//  * Pobiera adres IP klienta z żądania H3
//  *
//  * @param event - Obiekt wydarzenia H3
//  * @returns Adres IP klienta lub null
//  */
// export function getClientIp(event: H3Event): string | null {
//     // Próba pobrania z nagłówków przesyłanych przez load balancer/proxy
//     const forwardedFor = event.node.req.headers['x-forwarded-for']
//     if (forwardedFor) {
//         return Array.isArray(forwardedFor)
//             ? forwardedFor[0]?.split(',')[0]?.trim()
//             : forwardedFor.split(',')[0]?.trim()
//     }

//     // Próba pobrania z socket connection
//     return event.node.req.socket.remoteAddress || null
// }

// /**
//  * Extracts platform information from user agent string
//  * @param userAgent The user agent string from request headers
//  * @returns Object with platform details
//  */
// export function getPlatformFromUserAgent(userAgent?: string): Record<string, string | boolean> {
//     if (!userAgent) return { unknown: true };

//     const ua = userAgent.toLowerCase();
//     const platformInfo: Record<string, string | boolean> = {
//         mobile: false,
//         tablet: false,
//         desktop: true,
//         os: 'unknown',
//         browser: 'unknown',
//         browserVersion: 'unknown'
//     };

//     // Detect device type
//     if (/(android|webos|iphone|ipod|blackberry|iemobile|opera mini)/i.test(ua)) {
//         platformInfo.mobile = true;
//         platformInfo.desktop = false;
//     } else if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
//         platformInfo.tablet = true;
//         platformInfo.desktop = false;
//     }

//     // Detect operating system
//     if (/windows/i.test(ua)) {
//         platformInfo.os = 'Windows';
//     } else if (/macintosh|mac os x/i.test(ua)) {
//         platformInfo.os = 'macOS';
//     } else if (/linux/i.test(ua)) {
//         platformInfo.os = 'Linux';
//     } else if (/android/i.test(ua)) {
//         platformInfo.os = 'Android';
//     } else if (/iphone|ipad|ipod/i.test(ua)) {
//         platformInfo.os = 'iOS';
//     }

//     // Detect browser
//     if (/edge|edg/i.test(ua)) {
//         platformInfo.browser = 'Edge';
//         const match = ua.match(/(edge|edg)\/([\d.]+)/);
//         if (match) platformInfo.browserVersion = match[2];
//     } else if (/firefox/i.test(ua)) {
//         platformInfo.browser = 'Firefox';
//         const match = ua.match(/firefox\/([\d.]+)/);
//         if (match) platformInfo.browserVersion = match[1];
//     } else if (/chrome/i.test(ua)) {
//         platformInfo.browser = 'Chrome';
//         const match = ua.match(/chrome\/([\d.]+)/);
//         if (match) platformInfo.browserVersion = match[1];
//     } else if (/safari/i.test(ua)) {
//         platformInfo.browser = 'Safari';
//         const match = ua.match(/version\/([\d.]+)/);
//         if (match) platformInfo.browserVersion = match[1];
//     } else if (/msie|trident/i.test(ua)) {
//         platformInfo.browser = 'Internet Explorer';
//         const match = ua.match(/(msie |rv:)([\d.]+)/);
//         if (match) platformInfo.browserVersion = match[2];
//     }

//     return platformInfo;
// }

// export function generateDeviceId(userAgent: string = 'unknown', ipAddress?: string): string {
//     const baseString = `${userAgent}:${ipAddress || 'unknown'}`

//     // Create a simple hash of the base string
//     let hash = 0
//     for (let i = 0; i < baseString.length; i++) {
//         const char = baseString.charCodeAt(i)
//         hash = ((hash << 5) - hash) + char
//         hash = hash & hash // Convert to 32-bit integer
//     }

//     return `device_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`
// }