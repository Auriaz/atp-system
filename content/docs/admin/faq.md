---
title: 'FAQ dla Administratorów'
description: 'Najczęściej zadawane pytania przez administratorów systemu ATP - zarządzanie systemem, bezpieczeństwo, konfiguracja i wsparcie techniczne'
version: '1.0.0'
lastUpdated: '2025-05-26'
author: 'ATP System Team'
category: 'admin'
tags: ['faq', 'admin', 'system', 'bezpieczeństwo', 'konfiguracja', 'serwer', 'baza-danych', 'backup']
navigation:
  title: 'FAQ'
  icon: 'heroicons:question-mark-circle'
  order: 2
  badge: 'Pomoc'
permissions:
  view: ['admin']
  edit: ['admin']
---

# FAQ dla Administratorów

::alert{type="warning"}
🔐 **Uwaga**: Ta dokumentacja zawiera informacje techniczne przeznaczone dla administratorów systemu. Niektóre operacje mogą wpływać na działanie całego systemu.
::

::alert{type="info"}
💡 **Wskazówka**: Użyj Ctrl+F (Cmd+F na Mac) aby szybko znaleźć odpowiedź na konkretne pytanie.
::

## 🔧 Zarządzanie Systemem

### 1. Jak restartować serwer aplikacji?

::steps
1. Zaloguj się do panelu administracyjnego
2. Przejdź do sekcji **"System Management"**
3. Kliknij **"Application Server"**
4. Wybierz **"Graceful Restart"** (zalecane) lub **"Force Restart"**
5. Potwierdź operację
6. Monitoruj logi podczas restartu
::

::alert{type="danger"}
⚠️ **KRYTYCZNE**: Graceful restart pozwala na zakończenie aktywnych sesji. Force restart może spowodować utratę danych.
::

### 2. Jak monitorować wydajność serwera?

**Kluczowe metryki do monitorowania:**

::card-grid
:::card{title="CPU Usage" icon="heroicons:cpu-chip"}
- Średnie obciążenie: < 70%
- Peak usage: < 90%
- Alert przy > 85% przez > 5 min
:::

:::card{title="Memory Usage" icon="heroicons:rectangle-stack"}
- RAM utilization: < 80%
- Swap usage: < 10%
- Memory leaks detection
:::

:::card{title="Disk Space" icon="heroicons:server"}
- System disk: < 80%
- Data disk: < 85%
- Log rotation aktywna
:::

:::card{title="Network" icon="heroicons:signal"}
- Bandwidth utilization
- Connection count
- Response times
:::
::

### 3. Jak konfigurować load balancer?

**Konfiguracja nginx load balancer:**

```nginx
upstream atp_backend {
    server 192.168.1.10:3000 weight=3;
    server 192.168.1.11:3000 weight=2;
    server 192.168.1.12:3000 weight=1 backup;
}

server {
    listen 80;
    server_name atp-system.com;
    
    location / {
        proxy_pass http://atp_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. Jak aktualizować system do najnowszej wersji?

**Proces aktualizacji:**

::steps
1. **Backup** - kompletna kopia zapasowa systemu i bazy danych
2. **Test Environment** - aktualizacja na środowisku testowym
3. **Validation** - testy funkcjonalne i wydajnościowe
4. **Maintenance Window** - komunikat o przerwie technicznej
5. **Production Update** - aktualizacja środowiska produkcyjnego
6. **Rollback Plan** - przygotowany plan cofnięcia zmian
7. **Post-Update Testing** - weryfikacja działania systemu
::

## 🔐 Bezpieczeństwo

### 5. Jak konfigurować firewall?

**Zalecane reguły firewall:**

```bash
# Allow SSH (port 22)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS (ports 80/443)
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow database connections (internal network only)
iptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 5432 -j ACCEPT

# Block all other traffic
iptables -A INPUT -j DROP
```

### 6. Jak zarządzać certyfikatami SSL?

**SSL Certificate Management:**

::alert{type="success"}
✅ **Automatyczna odnowa certyfikatów Let's Encrypt**:
```bash
# Crontab entry for auto-renewal
0 2 * * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```
::

**Monitorowanie wygaśnięcia:**
- Alert 30 dni przed wygaśnięciem
- Alert 7 dni przed wygaśnięciem
- Daily certificate validation

### 7. Jak konfigurować 2FA dla administratorów?

**Implementacja dwuskładnikowego uwierzytelniania:**

1. **TOTP Setup** - konfiguracja Google Authenticator
2. **Backup Codes** - generowanie kodów zapasowych
3. **Policy Enforcement** - wymuszenie 2FA dla adminów
4. **Recovery Process** - procedura odzyskiwania dostępu

### 8. Jak przeprowadzać audyt bezpieczeństwa?

**Security Audit Checklist:**

::card-grid
:::card{title="System Hardening" icon="heroicons:shield-check"}
- OS security updates
- Service configuration review
- Unnecessary services disabled
- File permissions audit
:::

:::card{title="Network Security" icon="heroicons:wifi"}
- Firewall rules review
- VPN configuration
- Network segmentation
- Intrusion detection
:::

:::card{title="Application Security" icon="heroicons:code-bracket"}
- Dependency vulnerabilities
- SQL injection testing
- XSS prevention
- CSRF protection
:::

:::card{title="Access Control" icon="heroicons:key"}
- User permissions review
- Privilege escalation testing
- Password policy compliance
- Session management
:::
::

## 🗄️ Baza Danych

### 9. Jak optymalizować wydajność bazy danych?

**Database Performance Optimization:**

**Indexing Strategy:**
```sql
-- Indeksy dla często używanych zapytań
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON training_sessions(user_id);
CREATE INDEX idx_exercises_created_at ON exercises(created_at);

-- Composite indexes dla złożonych zapytań
CREATE INDEX idx_sessions_user_date ON training_sessions(user_id, session_date);
```

**Query Optimization:**
- EXPLAIN ANALYZE dla slow queries
- Connection pooling configuration
- Query timeout settings
- Regular statistics update

### 10. Jak konfigurować replikację bazy danych?

**PostgreSQL Master-Slave Replication:**

**Master Configuration (postgresql.conf):**
```conf
wal_level = replica
max_wal_senders = 3
max_replication_slots = 3
archive_mode = on
archive_command = 'test ! -f /var/lib/postgresql/archive/%f && cp %p /var/lib/postgresql/archive/%f'
```

**Slave Configuration:**
```conf
hot_standby = on
max_standby_streaming_delay = 30s
wal_receiver_status_interval = 10s
```

### 11. Jak przeprowadzać backup bazy danych?

**Automated Backup Strategy:**

::steps
1. **Daily Full Backup** - kompletna kopia bazy danych
2. **Hourly Incremental** - backup zmian z ostatniej godziny
3. **Point-in-Time Recovery** - możliwość przywrócenia na dowolny moment
4. **Offsite Storage** - kopie zapasowe w chmurze
5. **Backup Validation** - regularne testy odzyskiwania danych
::

**Backup Script Example:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U postgres atp_system > /backup/atp_system_$DATE.sql
aws s3 cp /backup/atp_system_$DATE.sql s3://atp-backups/daily/
```

### 12. Jak monitorować przestrzeń dyskową bazy danych?

**Database Space Monitoring:**

```sql
-- Sprawdzenie rozmiaru tabel
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitoring wzrostu bazy danych
SELECT 
    pg_size_pretty(pg_database_size('atp_system')) as database_size;
```

## 📊 Monitorowanie i Logi

### 13. Jak konfigurować system logowania?

**Log Configuration (logrotate):**

```conf
/var/log/atp-system/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    postrotate
        systemctl reload atp-system
    endscript
}
```

**Application Logging Levels:**
- **ERROR**: krytyczne błędy systemowe
- **WARN**: ostrzeżenia wymagające uwagi
- **INFO**: informacje o normalnej pracy systemu
- **DEBUG**: szczegółowe informacje diagnostyczne

### 14. Jak analizować logi systemu?

**Log Analysis Tools:**

::card-grid
:::card{title="Real-time Monitoring" icon="heroicons:eye"}
```bash
# Tail logs w czasie rzeczywistym
tail -f /var/log/atp-system/application.log

# Grep dla konkretnych błędów
grep -i "error" /var/log/atp-system/*.log
```
:::

:::card{title="Log Aggregation" icon="heroicons:funnel"}
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Centralized logging
- Alert configuration
- Dashboard creation
:::
::

### 15. Jak konfigurować monitoring alertów?

**Alert Configuration:**

```yaml
# alerts.yml
alerts:
  - name: high_cpu_usage
    condition: cpu_usage > 85
    duration: 5m
    notification: email,slack
    
  - name: disk_space_low
    condition: disk_usage > 90
    duration: 1m
    notification: email,sms
    
  - name: application_error_rate
    condition: error_rate > 1%
    duration: 2m
    notification: email,slack
```

## 🔄 Maintenance i Updates

### 16. Jak planować okna konserwacyjne?

**Maintenance Window Planning:**

::steps
1. **Impact Assessment** - analiza wpływu na użytkowników
2. **Stakeholder Communication** - powiadomienie 72h wcześniej
3. **Backup Creation** - kompletne kopie zapasowe
4. **Rollback Plan** - przygotowanie planu cofnięcia
5. **Testing Protocol** - scenariusze testowe post-maintenance
6. **Documentation** - dokumentacja przeprowadzonych zmian
::

### 17. Jak zarządzać dependency updates?

**Dependency Management:**

```bash
# Check for security updates
npm audit
pip-audit

# Update dependencies
npm update
pip install -r requirements.txt --upgrade

# Security-only updates
npm audit fix
```

### 18. Jak przeprowadzać migracje danych?

**Data Migration Best Practices:**

1. **Schema Backup** - kopia struktury bazy przed migracją
2. **Data Validation** - weryfikacja integralności danych
3. **Incremental Migration** - migracja w małych porcjach
4. **Rollback Strategy** - możliwość cofnięcia zmian
5. **Performance Testing** - testy wydajności po migracji

## 🌐 Networking i Infrastructure

### 19. Jak konfigurować CDN?

**CloudFlare CDN Configuration:**

```javascript
// Cache rules
const cacheRules = {
  "*.css": "1y",
  "*.js": "1y", 
  "*.png": "1y",
  "*.jpg": "1y",
  "/api/*": "no-cache"
};

// Security settings
const securityRules = {
  "ddos_protection": true,
  "rate_limiting": "100req/min",
  "geo_blocking": ["CN", "RU"]
};
```

### 20. Jak konfigurować reverse proxy?

**Nginx Reverse Proxy:**

```nginx
server {
    listen 443 ssl;
    server_name atp-system.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

### 21. Jak optymalizować network performance?

**Network Optimization:**

- **Compression**: gzip/brotli dla statycznych plików
- **Keep-Alive**: persistent connections
- **HTTP/2**: multiplexing connections
- **Caching**: aggressive caching strategies
- **Minification**: CSS/JS optimization

## 🐛 Troubleshooting

### 22. Jak diagnozować problemy z wydajnością?

**Performance Diagnostics:**

::alert{type="info"}
🔍 **Diagnostic Tools**:
- `top`, `htop` - system resources
- `iotop` - disk I/O monitoring
- `netstat` - network connections
- `strace` - system call tracing
- `tcpdump` - network packet analysis
::

**Common Performance Issues:**

1. **High CPU Usage**
   - Profile application code
   - Check for infinite loops
   - Database query optimization

2. **Memory Leaks**
   - Monitor heap usage
   - Analyze garbage collection
   - Check for memory-intensive operations

3. **Slow Database Queries**
   - Query execution plans
   - Index optimization
   - Connection pool tuning

### 23. Jak rozwiązywać problemy z połączeniem do bazy danych?

**Database Connection Issues:**

```bash
# Check database status
systemctl status postgresql

# Test connection
psql -h localhost -U postgres -d atp_system

# Check connection limits
SELECT count(*) FROM pg_stat_activity;
SHOW max_connections;

# Check locks
SELECT * FROM pg_locks WHERE NOT granted;
```

### 24. Jak obsługiwać system crashes?

**Crash Recovery Procedure:**

::steps
1. **Immediate Response** - restart failed services
2. **Log Analysis** - identyfikacja przyczyny crash'u
3. **System Validation** - sprawdzenie integralności danych
4. **Root Cause Analysis** - analiza pierwotnej przyczyny
5. **Prevention Measures** - implementacja zabezpieczeń
6. **Documentation** - dokumentacja incydentu
::

## 👥 User Management

### 25. Jak zarządzać kontami użytkowników?

**User Account Management:**

```sql
-- Create new admin user
INSERT INTO users (email, password_hash, role, created_at) 
VALUES ('admin@example.com', '$hashed_password', 'admin', NOW());

-- Disable user account
UPDATE users SET is_active = false WHERE email = 'user@example.com';

-- Reset user password
UPDATE users SET password_hash = '$new_hash', password_reset_token = NULL 
WHERE email = 'user@example.com';
```

### 26. Jak konfigurować role i uprawnienia?

**Role-Based Access Control:**

```sql
-- Create roles
INSERT INTO roles (name, permissions) VALUES 
('coach', '["view_athletes", "create_sessions", "view_reports"]'),
('athlete', '["view_own_data", "submit_feedback"]'),
('manager', '["view_all_data", "manage_team", "financial_reports"]');

-- Assign role to user
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'coach') 
WHERE email = 'coach@example.com';
```

### 27. Jak przeprowadzać bulk operations na użytkownikach?

**Bulk User Operations:**

```bash
# CSV import script
#!/bin/bash
while IFS=, read -r email first_name last_name role
do
    curl -X POST http://localhost:3000/api/admin/users \
         -H "Content-Type: application/json" \
         -d "{\"email\":\"$email\",\"firstName\":\"$first_name\",\"lastName\":\"$last_name\",\"role\":\"$role\"}"
done < users.csv
```

## 🔌 Integracje

### 28. Jak konfigurować integracje zewnętrzne?

**API Integration Setup:**

```javascript
// External service configuration
const integrations = {
  "fitness_tracker": {
    "api_key": process.env.FITNESS_TRACKER_API_KEY,
    "webhook_url": "https://atp-system.com/webhooks/fitness",
    "rate_limit": "1000req/hour"
  },
  "payment_gateway": {
    "merchant_id": process.env.PAYMENT_MERCHANT_ID,
    "secret_key": process.env.PAYMENT_SECRET_KEY,
    "sandbox": process.env.NODE_ENV !== "production"
  }
};
```

### 29. Jak monitorować integracje?

**Integration Monitoring:**

- **Health Checks**: regular API endpoint testing
- **Rate Limit Monitoring**: tracking API usage
- **Error Rate Tracking**: monitoring failed requests
- **Response Time Monitoring**: latency tracking
- **Webhook Validation**: ensuring data integrity

### 30. Jak obsługiwać API rate limiting?

**Rate Limiting Implementation:**

```javascript
const rateLimit = require('express-rate-limit');

const adminApiLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/admin', adminApiLimit);
```

## 📞 Support i Escalation

### 31. Gdzie znaleźć zaawansowaną pomoc techniczną?

**Support Channels:**

::card-grid
:::card{title="Level 1 Support" icon="heroicons:chat-bubble-left-right"}
- Email: support@atp-system.com
- Response: 4 business hours
- Scope: General issues
:::

:::card{title="Level 2 Support" icon="heroicons:phone"}
- Phone: +48 123 456 789
- Response: 2 business hours
- Scope: Technical issues
:::

:::card{title="Level 3 Support" icon="heroicons:wrench-screwdriver"}
- Emergency: +48 987 654 321
- Response: 30 minutes
- Scope: Critical system issues
:::

:::card{title="Engineering Team" icon="heroicons:code-bracket"}
- Slack: #atp-engineering
- Response: 1 business hour
- Scope: Bug reports, features
:::
::

### 32. Jak eskalować critical issues?

**Escalation Procedure:**

::steps
1. **Immediate Assessment** - severity classification
2. **Incident Creation** - ticket w systemie ITSM
3. **Stakeholder Notification** - powiadomienie zarządu
4. **War Room Setup** - zespół reagowania kryzysowego
5. **Regular Updates** - komunikacja co 30 minut
6. **Resolution Documentation** - post-mortem analysis
::

### 33. Jak dokumentować problemy techniczne?

**Issue Documentation Template:**

```markdown
## Problem Description
- **Summary**: Brief description
- **Severity**: Critical/High/Medium/Low
- **Impact**: User/System/Business impact
- **Environment**: Production/Staging/Development

## Reproduction Steps
1. Step one
2. Step two
3. Expected vs Actual result

## System Information
- **Server**: hostname/IP
- **Application Version**: x.y.z
- **Database Version**: PostgreSQL x.x
- **OS**: Ubuntu 20.04 LTS

## Logs and Evidence
- Error messages
- Screenshots
- Log excerpts
- Monitoring data

## Temporary Workaround
- Description of temporary solution
- Impact of workaround
- Timeline for permanent fix
```

---

## 🎯 Emergency Procedures

### Critical System Failure

**Emergency Response Checklist:**

::alert{type="danger"}
🚨 **CRITICAL**: Follow this checklist for system-wide failures
::

::steps
1. **Assess Impact** - determine scope of outage
2. **Activate Incident Team** - notify key personnel
3. **Communication** - status page update within 5 minutes
4. **Failover** - switch to backup systems if available
5. **Investigate** - identify root cause
6. **Fix** - implement solution
7. **Validate** - confirm system recovery
8. **Post-Mortem** - document lessons learned
::

### Data Breach Response

**Security Incident Response:**

1. **Contain** - isolate affected systems
2. **Assess** - determine data exposure
3. **Notify** - inform legal and compliance teams
4. **Investigate** - forensic analysis
5. **Remediate** - fix security vulnerabilities
6. **Report** - regulatory notifications if required

### Disaster Recovery

**DR Activation:**

- **RTO** (Recovery Time Objective): 4 hours
- **RPO** (Recovery Point Objective): 1 hour
- **Backup Site**: AWS region failover
- **Data Recovery**: Point-in-time restoration

---

::alert{type="warning"}
⚠️ **Nie znalazłeś odpowiedzi?** Skontaktuj się z zespołem engineering przez Slack #atp-engineering lub sprawdź szczegółową [dokumentację dla administratorów](/docs/admin/).
::

::alert{type="info"}
📚 **Przydatne linki**:
- [Panel Administracyjny](/admin)
- [System Monitoring](/monitoring)
- [Dokumentacja API](/api-docs)
- [Security Guidelines](/security)
- [Backup Management](/backup)
::
