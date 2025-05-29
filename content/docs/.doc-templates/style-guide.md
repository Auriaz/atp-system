---
title: 'Przewodnik stylistyczny dokumentacji'
description: 'Kompleksowy przewodnik stylistyczny dla dokumentacji ATP System - standardy, konwencje i najlepsze praktyki'
category: 'Development'
version: '1.0.0'
lastUpdated: '2025-05-28'
createdAt: '2025-05-28'
requiredRole: ['admin', 'editor', 'developer']
icon: 'i-heroicons-document-text'
author: 'Zespół ATP System'
tags: ['przewodnik-stylistyczny', 'dokumentacja', 'standardy', 'pisanie']
navigation:
  title: 'Przewodnik stylistyczny'
  icon: 'i-heroicons-document-text'
  order: 1
related:
  - '/docs/development/index'
  - '/docs/.doc-templates/standard-template'
seo:
  title: 'Przewodnik stylistyczny dokumentacji - ATP System'
  description: 'Standardy i konwencje dla dokumentacji ATP System'
  keywords: ['przewodnik-stylistyczny', 'dokumentacja', 'standardy']
docType: 'reference'
status: 'published'
difficulty: 'intermediate'
readingTime: 15
---

# Przewodnik stylistyczny dokumentacji

::alert{type="info"}
Ten przewodnik ustala standardy pisania, formatowania i organizacji dokumentacji w ATP System.
::

## 📋 Standardy frontmatter

### Pola wymagane

Cała dokumentacja musi zawierać następujące pola frontmatter:

```yaml
---
title: 'Tytuł dokumentu' # Jasny, opisowy tytuł
description: 'Krótki opis treści' # 1-2 zdania
category: 'Nazwa kategorii' # Standardowa kategoria
version: '1.0.0' # Wersjonowanie semantyczne
lastUpdated: '2025-05-28' # Format daty ISO
requiredRole: false # lub tablica ról ['admin', 'user']
icon: 'i-heroicons-nazwa-ikony' # Format Heroicons
author: 'Zespół ATP System' # lub konkretny autor
tags: ['tag1', 'tag2'] # Słowa kluczowe
navigation:
  title: 'Tytuł nawigacji' # Krótszy tytuł nawigacji
  icon: 'i-heroicons-nazwa-ikony' # Ikona nawigacji
  order: 1 # Opcjonalne uporządkowanie
---
```

### Pola opcjonalne

```yaml
createdAt: '2025-05-28' # Data utworzenia dokumentu
related: # Odnośniki krzyżowe
  - '/docs/category/related-doc'
seo: # Optymalizacja SEO
  title: 'Tytuł SEO'
  description: 'Opis SEO'
  keywords: ['słowo1', 'słowo2']
navigation:
  badge: 'Nowy' # Znaczek statusu
  group: 'Nazwa grupy' # Grupowanie nawigacji
```

## 📂 Organizacja plików

### Struktura katalogów

```
content/docs/
├── .doc-templates/        # Szablony dokumentacji
├── admin/                 # Dokumentacja administratora
├── athlete/               # Dokumentacja zawodników/użytkowników  
├── coach/                # Dokumentacja trenerów
├── development/          # Dokumentacja techniczna
├── editor/               # Dokumentacja edytorów treści
├── manager/              # Dokumentacja menedżerów
├── public/               # Dokumentacja publiczna
├── reports/              # Raporty systemowe
└── user/                 # Dokumentacja użytkowników ogólnych
```

### Konwencje nazewnictwa plików

- **Pliki indeksowe**: `index.md` (główna strona dla każdej kategorii)
- **Pliki FAQ**: `faq.md` (najczęściej zadawane pytania)
- **Konkretne tematy**: `kebab-case-naming.md`
- **Szablony**: Prefiks z `.` (np. `.doc-templates/`)

### Standardy kategorii

| Kategoria | Opis | Docelowa grupa |
|----------|-------------|----------------|
| `admin` | Administracja systemu | Administratorzy |
| `athlete` | Funkcje dla sportowców | Zawodnicy, Użytkownicy sportowi |
| `coach` | Zarządzanie treningiem | Trenerzy, Instruktorzy |
| `development` | Dokumentacja techniczna | Deweloperzy |
| `editor` | Zarządzanie treścią | Edytorzy treści |
| `manager` | Funkcje zarządcze | Menedżerowie, Liderzy zespołów |
| `public` | Informacje ogólne | Wszyscy użytkownicy |
| `reports` | Raporty systemowe | Wszyscy użytkownicy (filtrowane przez rolę) |
| `user` | Podstawowe funkcje użytkownika | Użytkownicy ogólni |

## ✍️ Standardy pisania

### Ton i głos

- **Profesjonalny ale przyjazny**: Dostępny, ale autorytatywny
- **Jasny i zwięzły**: Unikaj żargonu, wyjaśniaj terminy techniczne
- **Zorientowany na działanie**: Używaj strony czynnej i jasnych instrukcji
- **Spójna terminologia**: Używaj tych samych terminów w całej dokumentacji

### Wytyczne językowe

#### Nagłówki i tytuły
- Używaj wielkości zdaniowej: "Pierwsze kroki z planami treningowymi"
- Bądź opisowy: "Jak utworzyć swój pierwszy trening" zamiast "Tworzenie treningów"
- Włączaj słowa kluczowe dla wyszukiwania

#### Listy i instrukcje
- Używaj list numerowanych dla kroków sekwencyjnych
- Używaj punktorów dla list funkcji lub opcji
- Rozpoczynaj elementy akcji od czasowników: "Kliknij Zapisz", "Przejdź do Ustawień"

#### Kod i elementy techniczne
- Używaj `bloków kodu` dla kodu inline lub elementów UI
- Używaj potrójnych backticków dla fragmentów kodu
- Włączaj specyfikację języka: ```typescript

## 🎨 Standardy formatowania

### Standardowe komponenty

#### Alerty
```markdown
::alert{type="info"}
Ogólne informacje lub wskazówki
::

::alert{type="success"}
Pozytywne wyniki lub pomyślne zakończenie
::

::alert{type="warning"}
Ważne ostrzeżenia lub przestrogi
::

::alert{type="error"}
Stany błędów lub krytyczne problemy
::
```

#### Karty i siatki
```markdown
::card-grid
#default
  ::card{icon="i-heroicons-ikona" title="Tytuł karty"}
  Treść i opis karty
  ::
::
```

#### Listy z typami
```markdown
::list{type="success"}
- Pierwszy element
- Drugi element
::

::list{type="warning"}
- Element ostrzeżenia
- Inne ostrzeżenie
::
```

#### Grupy kodu
```markdown
::code-group
```bash [Linia poleceń]
npm install package
```

```typescript [TypeScript]
const example = 'code';
```
::
```

### Standardy typograficzne

#### Nacisk
- **Pogrubienie**: Dla ważnych terminów, elementów UI i nagłówków sekcji
- *Kursywa*: Dla nacisku i pierwszego użycia terminu
- `Kod`: Dla kodu, nazw plików i nazw przycisków UI

#### Linki
- Używaj opisowego tekstu linku: [Przewodnik zarządzania użytkownikami](/docs/admin/users)
- Unikaj "kliknij tutaj" lub ogólnego tekstu
- Uwzględniaj względne ścieżki dla linków wewnętrznych

### Elementy wizualne

#### Ikony
- Używaj formatu Heroicons: `i-heroicons-nazwa-ikony`
- Wybieraj ikony, które jasno reprezentują treść
- Bądź spójny w podobnych typach dokumentów

#### Znaczki
- `Nowy`: Dla niedawno dodanych funkcji
- `Zaktualizowany`: Dla niedawno zaktualizowanej treści
- `Beta`: Dla funkcji eksperymentalnych
- `Przestarzały`: Dla nieaktualnej treści

## 🔗 Odnośniki krzyżowe

### Standardy linków

#### Linki wewnętrzne
```markdown
- [Pierwsze kroki](/docs/public/getting-started)
- [Zarządzanie użytkownikami](/docs/admin/users)
- [FAQ](/docs/category/faq)
```

#### Sekcja powiązanej dokumentacji
Uwzględnij na końcu dokumentów:
```markdown
## 📚 Powiązana dokumentacja

- [Powiązany przewodnik 1](/docs/category/guide1)
- [Powiązany przewodnik 2](/docs/category/guide2)
- [FAQ](/docs/category/faq)
```

#### Odnośniki krzyżowe w frontmatter
```yaml
related:
  - '/docs/category/related-doc'
  - '/docs/category/another-doc'
```

## 🔍 SEO i odkrywalność

### Najlepsze praktyki SEO

```yaml
seo:
  title: 'Konkretny tytuł strony - ATP System'
  description: 'Szczegółowy opis poniżej 160 znaków'
  keywords: ['główne-słowo-kluczowe', 'dodatkowe-słowo-kluczowe', 'atp-system']
```

### Strategia tagowania

#### Kategorie tagów
- **Tagi ról**: `admin`, `coach`, `athlete`, `user`
- **Tagi funkcji**: `training`, `analytics`, `reports`, `settings`
- **Typ treści**: `guide`, `tutorial`, `reference`, `faq`
- **Trudność**: `beginner`, `intermediate`, `advanced`

#### Przykłady tagów
```yaml
tags: ['coach', 'training-plans', 'guide', 'intermediate']
```

## 📊 Struktura treści

### Standardowa struktura dokumentu

1. **Tytuł i wprowadzenie**
   - Jasny tytuł H1
   - Krótkie wprowadzenie z polem alertu

2. **Sekcja przeglądu**
   - Podsumowanie funkcji
   - Kluczowe korzyści
   - Grupa docelowa

3. **Główna treść**
   - Logiczna progresja sekcji
   - Instrukcje krok po kroku
   - Pomoce wizualne tam, gdzie pomocne

4. **Rozwiązywanie problemów**
   - Częste problemy
   - Rozwiązania
   - Kiedy skontaktować się z wsparciem

5. **Powiązane zasoby**
   - Odnośniki krzyżowe
   - Linki zewnętrzne
   - Następne kroki

### Wytyczne dotyczące długości strony

- **Strony przeglądu**: 500-1000 słów
- **Strony tutoriali**: 1000-2000 słów
- **Strony referencyjne**: Według potrzeb dla kompletności
- **Strony FAQ**: 20-30 częstych pytań

## 🔒 Kontrola dostępu

### Dokumentacja oparta na rolach

#### Dokumentacja publiczna
```yaml
requiredRole: false
```

#### Dokumentacja specyficzna dla ról
```yaml
requiredRole: ['admin', 'manager']
```

#### Pojedyncza rola
```yaml
requiredRole: 'admin'
```

### Wrażliwość treści

- **Publiczna**: Informacje ogólne, przewodniki wprowadzające
- **Specyficzna dla roli**: Dokumentacja funkcji wymagająca określonych uprawnień
- **Administracyjna**: Konfiguracja systemu, zarządzanie użytkownikami
- **Deweloperska**: Szczegóły implementacji technicznej

## ✅ Lista kontrolna jakości

### Przed publikacją

- [ ] Frontmatter kompletny i dokładny
- [ ] Treść zgodna z przewodnikiem stylistycznym
- [ ] Linki przetestowane i działające
- [ ] Gramatyka i pisownia sprawdzone
- [ ] Odnośniki krzyżowe dodane
- [ ] Pola SEO zoptymalizowane
- [ ] Odpowiednie ograniczenia ról ustawione
- [ ] Powiązana dokumentacja zaktualizowana

### Regularna konserwacja

- [ ] Przegląd kwartalny pod kątem dokładności
- [ ] Aktualizacja zrzutów ekranu i przykładów
- [ ] Weryfikacja działania wszystkich linków
- [ ] Aktualizacja numerów wersji
- [ ] Sprawdzenie nieaktualnych informacji

## 📝 Użycie szablonów

### Dostępne szablony

1. **Szablon standardowy** (`.doc-templates/standard-template.md`)
   - Dokumentacja ogólna
   - Przewodniki funkcji
   - Materiały referencyjne

2. **Szablon roli** (`.doc-templates/role-template.md`)
   - Dokumentacja specyficzna dla ról
   - Przewodniki użytkownika
   - Dokumentacja przepływów pracy

3. **Szablon FAQ** (`.doc-templates/faq-template.md`)
   - Format pytań i odpowiedzi
   - Przewodniki rozwiązywania problemów
   - Częste problemy

### Tworzenie nowych dokumentów

1. Skopiuj odpowiedni szablon
2. Zmień nazwę pliku zgodnie z konwencjami nazewnictwa
3. Zaktualizuj pola frontmatter
4. Zastąp treść szablonu
5. Dodaj do struktury nawigacji
6. Zaktualizuj powiązane dokumenty

---

## 📚 Powiązane zasoby

- [Konfiguracja treści](/content.config.ts)
- [Szablony dokumentacji](/docs/.doc-templates/)
- [System nawigacji](/app/components/X/Documentation/)

::alert{type="success"}
Przestrzeganie tego przewodnika stylistycznego zapewnia spójną, profesjonalną i przyjazną dla użytkownika dokumentację w całym ATP System.
::

---

*Ostatnia aktualizacja: {{ $doc.lastUpdated }} | Wersja: {{ $doc.version }}*
