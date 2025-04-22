---
title: 'API Reference'
description: 'Dokumentacja interfejsu programistycznego (API) systemu ATP dla integratorów i deweloperów'
category: 'Integracja'
version: '1.0.0'
requiredRole: true
icon: 'i-heroicons-code-bracket'
createdAt: '2025-04-12'
---

# Dokumentacja API

ATP System udostępnia interfejs programistyczny (API), który pozwala na integrację z zewnętrznymi aplikacjami i usługami. Nasze API opiera się na standardzie REST i wykorzystuje format JSON do wymiany danych.

## Informacje ogólne

### Podstawowy URL

Wszystkie zapytania do API powinny być kierowane do następującego adresu bazowego:

```
https://api.atp-system.com/v1
```

::alert{type="warning"}
Zalecamy korzystanie z najnowszej wersji API. Starsze wersje mogą być stopniowo wycofywane.
::

### Autentykacja

API ATP System wykorzystuje tokeny JWT (JSON Web Tokens) do autentykacji zapytań. Aby uzyskać token:

1. Zarejestruj aplikację w [Portalu Dewelopera](https://developers.atp-system.com)
2. Otrzymasz `client_id` i `client_secret`
3. Wykonaj zapytanie POST do endpointu autentykacji:

```bash
curl -X POST https://api.atp-system.com/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"client_id": "YOUR_CLIENT_ID", "client_secret": "YOUR_CLIENT_SECRET"}'
```

4. W odpowiedzi otrzymasz token JWT:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

5. Dołącz token do każdego zapytania w nagłówku `Authorization`:

```bash
curl -X GET https://api.atp-system.com/v1/athletes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Limity zapytań

API posiada następujące limity zapytań:

| Plan | Limit na minutę | Limit dzienny |
|------|----------------|---------------|
| Podstawowy | 60 | 10,000 |
| Profesjonalny | 300 | 50,000 |
| Korporacyjny | 600 | 100,000 |

Po przekroczeniu limitu otrzymasz odpowiedź ze statusem `429 Too Many Requests`.

### Formaty odpowiedzi

API zwraca dane w formacie JSON. Każda odpowiedź zawiera kod statusu HTTP, który informuje o wyniku operacji:

- `2xx` - sukces
- `4xx` - błąd klienta (np. nieprawidłowe dane wejściowe)
- `5xx` - błąd serwera

Przykładowa poprawna odpowiedź:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 135
  }
}
```

Przykładowa odpowiedź z błędem:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

## Endpointy API

### Sportowcy

#### Pobieranie listy sportowców

```
GET /athletes
```

Parametry:

| Parametr | Typ | Opis |
|----------|-----|------|
| page | integer | Numer strony (domyślnie: 1) |
| per_page | integer | Liczba wyników na stronę (domyślnie: 20, maks: 100) |
| search | string | Wyszukiwanie po imieniu, nazwisku lub e-mailu |
| team_id | string | Filtrowanie po ID zespołu |
| status | string | Filtrowanie po statusie (active, inactive) |

Przykładowa odpowiedź:

```json
{
  "success": true,
  "data": [
    {
      "id": "ath_123456",
      "first_name": "Jan",
      "last_name": "Kowalski",
      "email": "jan@example.com",
      "status": "active",
      "created_at": "2025-01-15T08:30:00Z",
      "updated_at": "2025-04-02T14:25:10Z"
    },
    // ...więcej sportowców
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 135
  }
}
```

#### Pobieranie szczegółów sportowca

```
GET /athletes/:id
```

Parametry ścieżki:

| Parametr | Typ | Opis |
|----------|-----|------|
| id | string | Unikalny identyfikator sportowca |

Przykładowa odpowiedź:

```json
{
  "success": true,
  "data": {
    "id": "ath_123456",
    "first_name": "Jan",
    "last_name": "Kowalski",
    "email": "jan@example.com",
    "phone": "+48123456789",
    "date_of_birth": "1995-08-21",
    "gender": "male",
    "height": 182,
    "weight": 78.5,
    "status": "active",
    "teams": [
      {
        "id": "team_789012",
        "name": "Drużyna A"
      }
    ],
    "coaches": [
      {
        "id": "coach_345678",
        "name": "Anna Nowak"
      }
    ],
    "created_at": "2025-01-15T08:30:00Z",
    "updated_at": "2025-04-02T14:25:10Z"
  }
}
```

#### Tworzenie sportowca

```
POST /athletes
```

Przykładowe dane wejściowe:

```json
{
  "first_name": "Adam",
  "last_name": "Wiśniewski",
  "email": "adam@example.com",
  "phone": "+48987654321",
  "date_of_birth": "1998-03-12",
  "gender": "male",
  "height": 175,
  "weight": 72.0
}
```

#### Aktualizacja sportowca

```
PUT /athletes/:id
```

Parametry ścieżki:

| Parametr | Typ | Opis |
|----------|-----|------|
| id | string | Unikalny identyfikator sportowca |

Przykładowe dane wejściowe:

```json
{
  "phone": "+48123123123",
  "weight": 73.5
}
```

#### Usuwanie sportowca

```
DELETE /athletes/:id
```

Parametry ścieżki:

| Parametr | Typ | Opis |
|----------|-----|------|
| id | string | Unikalny identyfikator sportowca |

### Treningi

#### Pobieranie treningów sportowca

```
GET /athletes/:athlete_id/workouts
```

Parametry ścieżki:

| Parametr | Typ | Opis |
|----------|-----|------|
| athlete_id | string | ID sportowca |

Parametry zapytania:

| Parametr | Typ | Opis |
|----------|-----|------|
| start_date | string | Data początkowa (format: YYYY-MM-DD) |
| end_date | string | Data końcowa (format: YYYY-MM-DD) |
| status | string | Filtrowanie po statusie (planned, completed, missed) |

#### Tworzenie treningu

```
POST /workouts
```

Przykładowe dane wejściowe:

```json
{
  "athlete_id": "ath_123456",
  "plan_id": "plan_789012",
  "title": "Trening siłowy - górna część ciała",
  "description": "Skupienie na klatce i barkach",
  "scheduled_date": "2025-04-25",
  "scheduled_time": "18:00:00",
  "duration": 90,
  "exercises": [
    {
      "name": "Wyciskanie sztangi",
      "sets": 4,
      "reps": "8-10",
      "rest": 120,
      "load": "75% 1RM",
      "notes": "Skupić się na kontrolowanym opuszczaniu"
    },
    // ...więcej ćwiczeń
  ]
}
```

### Plany treningowe

#### Pobieranie planów treningowych

```
GET /training-plans
```

#### Tworzenie planu treningowego

```
POST /training-plans
```

#### Aktualizacja planu treningowego

```
PUT /training-plans/:id
```

#### Usuwanie planu treningowego

```
DELETE /training-plans/:id
```

### Statystyki i analizy

#### Pobieranie statystyk sportowca

```
GET /athletes/:athlete_id/stats
```

Parametry ścieżki:

| Parametr | Typ | Opis |
|----------|-----|------|
| athlete_id | string | ID sportowca |

Parametry zapytania:

| Parametr | Typ | Opis |
|----------|-----|------|
| period | string | Okres analizy (week, month, quarter, year) |
| metric | string | Typ metryki (load, volume, intensity, etc.) |

#### Generowanie raportów

```
POST /reports
```

Przykładowe dane wejściowe:

```json
{
  "type": "training_load",
  "athlete_ids": ["ath_123456", "ath_789012"],
  "start_date": "2025-03-01",
  "end_date": "2025-03-31",
  "group_by": "week",
  "format": "pdf"
}
```

## Webhook'i

ATP System umożliwia konfigurację webhooków, które powiadamiają Twoją aplikację o określonych zdarzeniach.

### Rejestracja webhooków

```
POST /webhooks
```

Przykładowe dane wejściowe:

```json
{
  "url": "https://your-app.com/webhooks/atp",
  "events": [
    "workout.completed",
    "athlete.updated",
    "plan.assigned"
  ],
  "secret": "your_webhook_secret"
}
```

### Format powiadomień

Przykład powiadomienia o zakończonym treningu:

```json
{
  "event": "workout.completed",
  "timestamp": "2025-04-12T14:30:45Z",
  "data": {
    "workout_id": "wo_345678",
    "athlete_id": "ath_123456",
    "title": "Trening siłowy - górna część ciała",
    "completed_at": "2025-04-12T14:30:00Z",
    "duration": 95,
    "feedback": {
      "athlete_rating": 4,
      "athlete_notes": "Czułem się dobrze, ale ostatnia seria była bardzo trudna"
    }
  }
}
```

## Kody błędów

| Kod | Opis |
|-----|------|
| `AUTHENTICATION_ERROR` | Problem z autentykacją (brak tokenu, wygasły token) |
| `AUTHORIZATION_ERROR` | Brak uprawnień do wykonania operacji |
| `RESOURCE_NOT_FOUND` | Żądany zasób nie istnieje |
| `VALIDATION_ERROR` | Nieprawidłowe dane wejściowe |
| `RATE_LIMIT_EXCEEDED` | Przekroczono limit zapytań |
| `INTERNAL_SERVER_ERROR` | Wewnętrzny błąd serwera |

## SDK i biblioteki klienckie

ATP System udostępnia oficjalne biblioteki klienckie dla popularnych języków programowania:

- [JavaScript/TypeScript](https://github.com/atp-system/atp-js)
- [Python](https://github.com/atp-system/atp-python)
- [PHP](https://github.com/atp-system/atp-php)
- [Java](https://github.com/atp-system/atp-java)
- [.NET](https://github.com/atp-system/atp-dotnet)

## Zasoby dla deweloperów

- [Portal deweloperski](https://developers.atp-system.com)
- [Dokumentacja OpenAPI](https://api.atp-system.com/docs)
- [Środowisko testowe](https://sandbox.atp-system.com)
- [Forum deweloperów](https://community.atp-system.com/developers)

## Wsparcie

Jeśli masz pytania dotyczące API, skontaktuj się z nami:

- E-mail: api-support@atp-system.com
- [Portal wsparcia](https://support.atp-system.com/api)
```

Te dokumenty zapewniają kompleksową i spójną dokumentację dla użytkowników systemu ATP. Są sformatowane zgodnie ze standardami Markdown i zawierają odpowiednie metadane w formacie frontmatter, który jest wymagany przez Nuxt Content.Te dokumenty zapewniają kompleksową i spójną dokumentację dla użytkowników systemu ATP. Są sformatowane zgodnie ze standardami Markdown i zawierają odpowiednie metadane w formacie frontmatter, który jest wymagany przez Nuxt Content.
