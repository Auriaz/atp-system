// composables/useDocumentation.ts

export function useDocumentation() {
  const { userRoles } = usePermissions();

  /**
   * Sprawdza, czy użytkownik ma dostęp do dokumentu na podstawie wymaganych ról
   * @param document Dokument z opcjonalnymi wymaganiami dot. ról
   * @returns Czy użytkownik ma dostęp do dokumentu
   */
  const checkDocumentAccess = (document: { requiredRole?: string | string[] }) => {
    if (!document) return false;

    // Jeśli dokument nie ma wymagań dotyczących roli, jest publiczny
    if (!document.requiredRole) return true;

    // Jeśli użytkownik ma rolę administratora, ma dostęp do wszystkiego
    if (userRoles.value.includes('admin')) return true;

    // Sprawdź, czy jakakolwiek rola użytkownika jest w wymaganych rolach dokumentu
    const requiredRoles = Array.isArray(document.requiredRole)
      ? document.requiredRole
      : [document.requiredRole];

    return userRoles.value.some((role: string) => requiredRoles.includes(role));
  };

  /**
   * Pobiera dokumenty dostępne dla bieżącego użytkownika z określonej kolekcji
   * @param collection Nazwa kolekcji dokumentów
   * @returns Filtrowana lista dokumentów dostępnych dla użytkownika
   */
  const getAccessibleDocuments = async (collection = 'docs') => {
    // W Nuxt Content 3 używamy queryCollection
    const docs = await queryCollection(collection)
      .select('title', 'description', 'category', 'requiredRole', '_path')
      .all();

    // Filtruj według ról użytkownika
    return docs.filter(checkDocumentAccess);
  };

  /**
   * Pobiera dokumenty pogrupowane według kategorii
   * @param collection Nazwa kolekcji dokumentów
   * @returns Dokumenty pogrupowane według kategorii
   */
  const getDocumentsByCategory = async (collection = 'docs') => {
    const docs = await getAccessibleDocuments(collection);

    // Grupuj po kategoriach
    const categoriesMap: Record<string, any[]> = {};
    docs.forEach(doc => {
      const category = doc.category || 'Bez kategorii';
      if (!categoriesMap[category]) {
        categoriesMap[category] = [];
      }
      categoriesMap[category].push(doc);
    });

    return Object.entries(categoriesMap).map(([name, items]) => ({
      name,
      items
    }));
  };

  /**
   * Pobiera nawigację dokumentacji filtrowaną według uprawnień użytkownika
   * @param collection Nazwa kolekcji dokumentów
   * @returns Struktura nawigacji dostępna dla użytkownika
   */
  const getAccessibleNavigation = async (collection = 'docs') => {
    // W Nuxt Content 3 używamy queryCollectionNavigation
    const nav = await queryCollectionNavigation(collection);

    // Funkcja rekurencyjna do filtrowania nawigacji
    const filterNav = (items: any[]): any[] => {
      if (!items) return [];

      return items
        .filter(item => checkDocumentAccess(item))
        .map(item => ({
          ...item,
          children: item.children ? filterNav(item.children) : undefined
        }));
    };

    // Zwróć przefiltrowaną nawigację
    return filterNav(nav);
  };

  /**
   * Pobiera otoczenie dokumentu (poprzedni/następny)
   * @param path Ścieżka do dokumentu
   * @param collection Nazwa kolekcji dokumentów
   * @returns Otoczenie dokumentu [poprzedni, następny]
   */
  const getDocumentSurroundings = async (path: string, collection = 'docs') => {
    // W Nuxt Content 3 używamy queryCollectionItemSurroundings
    return await queryCollectionItemSurroundings(collection, path);
  };

  /**
   * Wyszukuje dokumenty według zapytania i filtruje według uprawnień
   * @param query Zapytanie wyszukiwania
   * @param collection Nazwa kolekcji dokumentów
   * @returns Filtrowane wyniki wyszukiwania
   */
  const searchDocuments = async (query: string, collection = 'docs') => {
    if (!query || query.trim().length < 3) {
      return [];
    }

    // W Nuxt Content 3 używamy queryCollectionSearchSections
    const searchResults = await queryCollectionSearchSections(collection, query);

    // Filtruj wyniki wg uprawnień
    return searchResults.filter(result => checkDocumentAccess(result));
  };

  /**
   * Pobiera pojedynczy dokument według ścieżki
   * @param path Ścieżka do dokumentu (bez prefiksu kolekcji)
   * @param collection Nazwa kolekcji dokumentów
   * @returns Dokument jeśli istnieje i użytkownik ma do niego dostęp
   */
  const getDocument = async (path: string, collection = 'docs') => {
    // Sformatuj pełną ścieżkę
    const fullPath = path.startsWith('/') ? path : `/${path}`;

    // W Nuxt Content 3 używamy queryCollection z ograniczeniem do jednej ścieżki
    const docs = await queryCollection(collection, {
      where: { _path: fullPath }
    });

    // Jeśli dokument nie istnieje lub użytkownik nie ma dostępu, zwróć null
    if (!docs.length || !checkDocumentAccess(docs[0])) {
      return null;
    }

    return docs[0];
  };

  return {
    checkDocumentAccess,
    getAccessibleDocuments,
    getDocumentsByCategory,
    getAccessibleNavigation,
    getDocumentSurroundings,
    searchDocuments,
    getDocument
  };
}