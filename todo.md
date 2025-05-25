✅ Nowy model refresh_tokens w bazie danych (już utworzony)
✅ Aktualizacja schematu bazy danych (już zrobione)
🔄 Dokończenie refresh_tokens.repository.ts (naprawienie błędów Drizzle ORM)
🔄 Dokończenie jwt.service.ts (dodanie importów i obsługi błędów)
⏳ Migracja bazy danych dla nowej tabeli

⏳ Aktualizacja endpointów /api/auth/login i /api/auth/register
⏳ Nowy endpoint /api/auth/refresh do odnawiania tokenów
⏳ Middleware do walidacji tokenów dostępu
Frontend:

⏳ Automatyczne odświeżanie tokenów w composables
⏳ Obsługa wylogowania przy błędach refresh token
⏳ Zarządzanie sesjami na wielu urządzeniach