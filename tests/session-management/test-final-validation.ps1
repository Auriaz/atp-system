# Session Management System - Final Validation Test
# PowerShell script to test the complete session management functionality

Write-Host "🚀 ATP System - Session Management Final Validation" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Test server connectivity
Write-Host "`n1️⃣ Testing server connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3003" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Server is accessible" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Server returned status: $($response.StatusCode)" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Server is not accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test API endpoints availability
Write-Host "`n2️⃣ Testing API endpoints..." -ForegroundColor Yellow

$endpoints = @(
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/sessions"
)

foreach ($endpoint in $endpoints) {
    try {
        if ($endpoint -eq "/api/auth/sessions") {
            # This endpoint requires authentication, expect 401
            $response = Invoke-WebRequest -Uri "http://localhost:3003$endpoint" -Method GET -TimeoutSec 5
            Write-Host "❌ $endpoint - Expected 401 but got $($response.StatusCode)" -ForegroundColor Red
        }
        else {
            # These are public endpoints for POST, check if they exist
            $headers = @{ "Content-Type" = "application/json" }
            $body = '{"test": "probe"}'
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3003$endpoint" -Method POST -Headers $headers -Body $body -TimeoutSec 5
                Write-Host "✅ $endpoint - Endpoint accessible (Status: $($response.StatusCode))" -ForegroundColor Green
            }
            catch {
                if ($_.Exception.Response.StatusCode -eq 400) {
                    Write-Host "✅ $endpoint - Endpoint accessible (400 expected for invalid data)" -ForegroundColor Green
                }
                else {
                    Write-Host "⚠️ $endpoint - Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
                }
            }
        }
    }
    catch {
        if ($endpoint -eq "/api/auth/sessions" -and $_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✅ $endpoint - Properly secured (401 unauthorized)" -ForegroundColor Green
        }
        else {
            Write-Host "❌ $endpoint - Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Test pages accessibility
Write-Host "`n3️⃣ Testing page accessibility..." -ForegroundColor Yellow

$pages = @(
    "/auth/register",
    "/auth/login",
    "/dashboard/sessions"
)

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3003$page" -Method GET -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $page - Page accessible" -ForegroundColor Green
        }
        else {
            Write-Host "❌ $page - Status: $($response.StatusCode)" -ForegroundColor Red
        }
    }
    catch {
        if ($page -eq "/dashboard/sessions" -and $_.Exception.Response.StatusCode -eq 302) {
            Write-Host "✅ $page - Properly redirected (authentication required)" -ForegroundColor Green
        }
        else {
            Write-Host "❌ $page - Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Run the validation script
Write-Host "`n4️⃣ Running comprehensive validation..." -ForegroundColor Yellow
try {
    node tests/session-management/validate-session-management.cjs
}
catch {
    Write-Host "❌ Validation script failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Final Validation Complete!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "`n📋 Next Steps:" -ForegroundColor Blue
Write-Host "1. Open browser: http://localhost:3003" -ForegroundColor White
Write-Host "2. Register a new account" -ForegroundColor White
Write-Host "3. Navigate to Dashboard > Sessions" -ForegroundColor White
Write-Host "4. Test session management features" -ForegroundColor White
Write-Host "5. Test from multiple browsers/devices" -ForegroundColor White
