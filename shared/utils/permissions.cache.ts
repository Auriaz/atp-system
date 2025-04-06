
/**
 * Zunifikowany cache uprawnień użytkowników - działa zarówno po stronie klienta jak i serwera
 * Przechowuje uprawnienia użytkowników w pamięci podręcznej, aby uniknąć częstego wyliczania
 */

// Podstawowa struktura cache'a po stronie klienta
const clientCache = new Map<number, Set<Permission>>();

// Rozszerzona struktura cache'a po stronie serwera z TTL
const serverCache = new Map<number, {
  permissions: Set<Permission>,
  timestamp: number,
  ttl: number
}>();

// Domyślny czas życia cache'a w milisekundach (5 minut)
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Pobiera uprawnienia użytkownika z cache'a
 * @param userId ID użytkownika
 * @returns Set uprawnień lub undefined/null jeśli nie ma w cache
 */
export function getCachedPermissions(userId: number): Set<Permission> | null | undefined {
  // Sprawdź, po której stronie jesteśmy
  if (import.meta.server) {
    const cachedData = serverCache.get(userId);
    if (!cachedData) return null;

    // Sprawdź czy cache nie wygasł
    if (Date.now() - cachedData.timestamp > cachedData.ttl) {
      serverCache.delete(userId);
      return null;
    }

    return cachedData.permissions;
  } else {
    // Po stronie klienta
    return clientCache.get(userId);
  }
}

/**
 * Zapisuje uprawnienia użytkownika do cache'a
 * @param userId ID użytkownika
 * @param permissions Lista uprawnień
 * @param ttl Opcjonalny czas życia w ms (tylko po stronie serwera)
 */
export function setCachedPermissions(
  userId: number,
  permissions: Permission[],
  ttl: number = DEFAULT_CACHE_TTL
): void {
  const permissionsSet = new Set(permissions);

  if (import.meta.server) {
    // Po stronie serwera zapisz z TTL
    serverCache.set(userId, {
      permissions: permissionsSet,
      timestamp: Date.now(),
      ttl
    });
  } else {
    // Po stronie klienta zapisz do prostego cache
    clientCache.set(userId, permissionsSet);
  }
}

/**
 * Usuwa uprawnienia użytkownika z cache'a
 * @param userId ID użytkownika
 */
export function clearCachedPermissions(userId: number): void {
  if (import.meta.server) {
    serverCache.delete(userId);
  } else {
    clientCache.delete(userId);
  }
}

/**
 * Czyści cały cache uprawnień
 */
export function clearAllCachedPermissions(): void {
  if (import.meta.server) {
    serverCache.clear();
  } else {
    clientCache.clear();
  }
}

/**
 * Dla zachowania kompatybilności z kodem serwerowym używającym starej nazwy
 */
export const invalidateCache = clearCachedPermissions;
export const clearAllCache = clearAllCachedPermissions;

// Automatyczne czyszczenie cache'a po stronie serwera
if (import.meta.server) {
  const cleanupInterval = 60 * 1000; // Co minutę

  setInterval(() => {
    const now = Date.now();

    for (const [userId, cachedData] of serverCache.entries()) {
      if (now - cachedData.timestamp > cachedData.ttl) {
        serverCache.delete(userId);
      }
    }
  }, cleanupInterval);
}

// Eksportujemy domyślny TTL, aby można go było użyć w innych miejscach
export { DEFAULT_CACHE_TTL };
