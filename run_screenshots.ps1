# Script para executar captura de screenshots
# Execute: .\run_screenshots.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Script de Captura de Screenshots" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Python está instalado
Write-Host "?? Verificando Python..." -ForegroundColor Yellow
python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "? Python não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale Python de https://www.python.org/" -ForegroundColor Red
    exit 1
}

# Verificar se Docker está rodando
Write-Host ""
Write-Host "?? Verificando Docker..." -ForegroundColor Yellow
docker-compose ps > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "? Docker não está rodando!" -ForegroundColor Red
    Write-Host "Execute: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}
Write-Host "? Docker está rodando" -ForegroundColor Green

# Verificar se Playwright está instalado
Write-Host ""
Write-Host "?? Verificando Playwright..." -ForegroundColor Yellow
python -c "import playwright" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "??  Instalando Playwright..." -ForegroundColor Yellow
    pip install -r requirements.txt
    playwright install
}
Write-Host "? Playwright pronto" -ForegroundColor Green

# Executar script
Write-Host ""
Write-Host "?? Iniciando captura de screenshots..." -ForegroundColor Green
Write-Host ""
python screenshots_automation.py

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "? Screenshots capturadas com sucesso!" -ForegroundColor Green
    Write-Host "?? Verifique a pasta 'screenshots/' para as imagens" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "? Erro ao capturar screenshots" -ForegroundColor Red
}
