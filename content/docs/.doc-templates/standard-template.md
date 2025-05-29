---
title: 'Tytuł szablonu'
description: 'Krótki opis zawartości dokumentu'
category: 'Nazwa kategorii'
version: '1.0.0'
lastUpdated: '2025-05-28'
createdAt: '2025-05-28'
requiredRole: false # lub ['rola1', 'rola2'] dla ograniczonego dostępu
icon: 'i-heroicons-document-text'
author: 'Zespół ATP System'
tags: ['tag1', 'tag2', 'tag3']
navigation:
  title: 'Tytuł nawigacji'
  icon: 'i-heroicons-document-text'
  order: 1
  badge: 'Nowy' # opcjonalny
related: # Odnośniki do powiązanych dokumentów
  - '/docs/category/related-doc'
  - '/docs/category/another-doc'
seo:
  title: 'Tytuł SEO'
  description: 'Opis SEO'
  keywords: ['słowo1', 'słowo2']
docType: 'guide'
status: 'published'
difficulty: 'beginner'
readingTime: 5
---

# Tytuł dokumentu

::alert{type="info"}
Krótki przegląd lub wprowadzenie do dokumentu
::

## Główna sekcja

Treść znajduje się tutaj...

### Podsekcja

Bardziej szczegółowa treść...

## Odnośniki krzyżowe

Powiązana dokumentacja:
- [Powiązany dokument 1](/docs/category/related-doc)
- [Powiązany dokument 2](/docs/category/another-doc)

## Rozwiązywanie problemów

Częste problemy i rozwiązania...

## FAQ

Najczęściej zadawane pytania...

---

*Ostatnia aktualizacja: {{ $doc.lastUpdated }} | Wersja: {{ $doc.version }}*
