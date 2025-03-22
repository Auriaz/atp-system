import { H3Event } from 'h3';

/**
 * Helper function to get the client's IP address from the request
 * @param event H3Event object containing request information
 * @returns Client IP address as string
 */
export function getClientIp(event: H3Event) {
  const forwarded = event.node.req.headers['x-forwarded-for']

  if (forwarded) {
    return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0]
  }
  return event.node.req.socket.remoteAddress || ''
}

/**
 * Extracts platform information from user agent string
 * @param userAgent The user agent string from request headers
 * @returns Object with platform details
 */
export function getPlatformFromUserAgent(userAgent?: string): Record<string, string | boolean> {
  if (!userAgent) return { unknown: true };

  const ua = userAgent.toLowerCase();
  const platformInfo: Record<string, string | boolean> = {
    mobile: false,
    tablet: false,
    desktop: true,
    os: 'unknown',
    browser: 'unknown',
    browserVersion: 'unknown'
  };

  // Detect device type
  if (/(android|webos|iphone|ipod|blackberry|iemobile|opera mini)/i.test(ua)) {
    platformInfo.mobile = true;
    platformInfo.desktop = false;
  } else if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    platformInfo.tablet = true;
    platformInfo.desktop = false;
  }

  // Detect operating system
  if (/windows/i.test(ua)) {
    platformInfo.os = 'Windows';
  } else if (/macintosh|mac os x/i.test(ua)) {
    platformInfo.os = 'macOS';
  } else if (/linux/i.test(ua)) {
    platformInfo.os = 'Linux';
  } else if (/android/i.test(ua)) {
    platformInfo.os = 'Android';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    platformInfo.os = 'iOS';
  }

  // Detect browser
  if (/edge|edg/i.test(ua)) {
    platformInfo.browser = 'Edge';
    const match = ua.match(/(edge|edg)\/([\d.]+)/);
    if (match) platformInfo.browserVersion = match[2];
  } else if (/firefox/i.test(ua)) {
    platformInfo.browser = 'Firefox';
    const match = ua.match(/firefox\/([\d.]+)/);
    if (match) platformInfo.browserVersion = match[1];
  } else if (/chrome/i.test(ua)) {
    platformInfo.browser = 'Chrome';
    const match = ua.match(/chrome\/([\d.]+)/);
    if (match) platformInfo.browserVersion = match[1];
  } else if (/safari/i.test(ua)) {
    platformInfo.browser = 'Safari';
    const match = ua.match(/version\/([\d.]+)/);
    if (match) platformInfo.browserVersion = match[1];
  } else if (/msie|trident/i.test(ua)) {
    platformInfo.browser = 'Internet Explorer';
    const match = ua.match(/(msie |rv:)([\d.]+)/);
    if (match) platformInfo.browserVersion = match[2];
  }

  return platformInfo;
}