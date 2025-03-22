# GitHub Labels for ATP Project

This document describes all labels used in the ATP (Advanced Training Platform) project's GitHub repository. Labels help categorize issues and pull requests to improve workflow organization and visibility.

## Type Labels

Labels that describe the type of task or issue.

| Label | Color | Description (EN) | Description (PL) |
|-------|-------|------------------|------------------|
| `core-feature` | `#FF0000` | Essential functionalities critical for the platform operation | Niezbędne funkcjonalności kluczowe dla działania platformy |
| `enhancement` | `#84B6EB` | Improvements to existing features that aren't critical | Ulepszenia istniejących funkcji, które nie są krytyczne |
| `infrastructure` | `#C5DEF5` | Tasks related to infrastructure, CI/CD, and environment setup | Zadania związane z infrastrukturą, konfiguracją CI/CD i środowiskiem |
| `ui` | `#FBCA04` | Tasks related to user interface and UX | Zadania związane z interfejsem użytkownika i UX |
| `database` | `#0E8A16` | Tasks related to database, data model, and migrations | Zadania związane z bazą danych, modelem danych i migracjami |
| `bug` | `#D73A4A` | Something isn't working as expected | Coś nie działa zgodnie z oczekiwaniami |
| `documentation` | `#0075CA` | Improvements or additions to documentation | Ulepszenia lub uzupełnienia dokumentacji |
| `feature` | `#A2EEEF` | New feature requests and implementations | Prośby o nowe funkcje i ich implementacje |

## Priority Labels

Labels that indicate the importance and urgency of the issue.

| Label | Color | Description (EN) | Description (PL) |
|-------|-------|------------------|------------------|
| `priority-critical` | `#B60205` | Highest priority tasks blocking other work | Zadania o najwyższym priorytecie, blokujące inne prace |
| `priority-high` | `#D93F0B` | Important tasks that should be completed as soon as possible | Ważne zadania, które powinny być wykonane jak najszybciej |
| `priority-medium` | `#FBCA04` | Medium priority tasks, important but not critical | Zadania o średnim priorytecie, ważne, ale niekrytyczne |
| `priority-low` | `#0E8A16` | Tasks that can be postponed | Zadania, które można odłożyć na później |

## Functional Area Labels

Labels that specify which area of the application the issue is related to.

| Label | Color | Description (EN) | Description (PL) |
|-------|-------|------------------|------------------|
| `authentication` | `#6F42C1` | Tasks related to authentication and authorization | Zadania związane z uwierzytelnianiem i autoryzacją |
| `user-management` | `#5319E7` | Tasks related to user and profile management | Zadania związane z zarządzaniem użytkownikami i profilami |
| `training-data` | `#1D76DB` | Tasks related to training data | Zadania związane z danymi treningowymi |
| `analytics` | `#0075CA` | Tasks related to data analysis and reporting | Zadania związane z analizą danych i raportowaniem |
| `notifications` | `#8250DF` | Tasks related to notification system | Zadania związane z systemem powiadomień |
| `security` | `#D93F0B` | Security-related tasks and improvements | Zadania i ulepszenia związane z bezpieczeństwem |
| `social-features` | `#0075CA` | Tasks related to community and social features | Zadania związane z funkcjami społecznościowymi |
| `dashboard` | `#1D76DB` | Tasks related to user dashboard and data visualization | Zadania związane z panelem użytkownika i wizualizacją danych |
| `core` | `#B60205` | Tasks related to core application functionality and architecture | Zadania związane z podstawową funkcjonalnością i architekturą aplikacji |
| `architecture` | `#0075CA` | Tasks related to application architecture and code organization | Zadania związane z architekturą aplikacji i organizacją kodu |
| `profiles` | `#5319E7` | Tasks related to user profiles and personal settings | Zadania związane z profilami użytkowników i ustawieniami osobistymi |
| `user-experience` | `#FBCA04` | Tasks focused on improving the overall user experience | Zadania skupione na poprawie ogólnego doświadczenia użytkownika |
| `accessibility` | `#0075CA` | Tasks related to making the application accessible to all users | Zadania związane z zapewnieniem dostępności aplikacji dla wszystkich użytkowników |
| `navigation` | `#1D76DB` | Tasks related to application navigation and information architecture | Zadania związane z nawigacją aplikacji i architekturą informacji |
| `roles` | `#6F42C1` | Tasks related to user roles and permissions management | Zadania związane z zarządzaniem rolami i uprawnieniami użytkowników |
| `content` | `#0075CA` | Tasks related to creating, editing and managing content | Zadania związane z tworzeniem, edycją i zarządzaniem treścią |

## Work Status Labels

Labels that indicate the current status of work on the issue.

| Label | Color | Description (EN) | Description (PL) |
|-------|-------|------------------|------------------|
| `analysis` | `#BFD4F2` | Tasks in analysis and requirements gathering stage | Zadania będące na etapie analizy i zbierania wymagań |
| `design` | `#D4C5F9` | Tasks in design phase | Zadania na etapie projektowania |
| `implementation` | `#0E8A16` | Tasks in implementation phase | Zadania na etapie implementacji |
| `testing` | `#FBCA04` | Tasks related to testing | Zadania związane z testowaniem |
| `completed` | `#0E8A16` | Completed tasks that passed tests and code review | Zadania zakończone, które przeszły testy i code review |
| `blocked` | `#D93F0B` | Tasks blocked by other work | Zadania zablokowane przez inne prace |
| `needs-review` | `#FBCA04` | Tasks that need code review | Zadania wymagające przeglądu kodu |

## Special Labels

Labels for special cases and workflow assistance.

| Label | Color | Description (EN) | Description (PL) |
|-------|-------|------------------|------------------|
| `good-first-issue` | `#7057FF` | Good for newcomers to the project | Dobre dla osób zaczynających pracę przy projekcie |
| `help-wanted` | `#008672` | Extra attention is needed | Potrzebna dodatkowa uwaga |
| `discussion` | `#D4C5F9` | Needs further discussion | Wymaga dalszej dyskusji |
| `duplicate` | `#CCCCCC` | This issue already exists | To zgłoszenie już istnieje |
| `wontfix` | `#CCCCCC` | This will not be worked on | Nie będziemy nad tym pracować |

## How to Use These Labels

1. **Multiple Labels**: Issues can and should have multiple labels. For example, an issue might be labeled as `authentication`, `bug`, and `priority-high`.

2. **Required Categories**: Each issue should have at least:
   - One type label
   - One priority label
   - One functional area label
   - One work status label (updated as the issue progresses)

3. **Changing Labels**: Labels should be updated as the issue progresses through different phases of development.

4. **Label Filters**: Use label filters in GitHub to view all issues of a certain type, priority, or status.

## Label Implementation

To implement these labels in GitHub:

1. Go to the repository
2. Click on "Issues" tab
3. In the left sidebar, click "Labels"
4. Click "New label"
5. Enter the label name, description, and choose the appropriate color
6. Repeat for all labels

You can also use GitHub's label export/import feature to quickly set up all labels at once.