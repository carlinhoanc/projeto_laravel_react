#!/bin/bash

# Script para executar captura de screenshots no Linux/Mac
# Execute: bash run_screenshots.sh

echo "========================================"
echo "  Script de Captura de Screenshots"
echo "========================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Verificar se Python está instalado
echo -e "${YELLOW}?? Verificando Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}? Python não encontrado!${NC}"
    echo "Por favor, instale Python 3 de https://www.python.org/"
    exit 1
fi
python3 --version

# Verificar se Docker está rodando
echo ""
echo -e "${YELLOW}?? Verificando Docker...${NC}"
if ! docker-compose ps > /dev/null 2>&1; then
    echo -e "${RED}? Docker não está rodando!${NC}"
    echo -e "${YELLOW}Execute: docker-compose up -d${NC}"
    exit 1
fi
echo -e "${GREEN}? Docker está rodando${NC}"

# Verificar se Playwright está instalado
echo ""
echo -e "${YELLOW}?? Verificando Playwright...${NC}"
if ! python3 -c "import playwright" 2>/dev/null; then
    echo -e "${YELLOW}??  Instalando Playwright...${NC}"
    pip3 install -r requirements.txt
    playwright install
fi
echo -e "${GREEN}? Playwright pronto${NC}"

# Executar script
echo ""
echo -e "${GREEN}?? Iniciando captura de screenshots...${NC}"
echo ""
python3 screenshots_automation.py

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}? Screenshots capturadas com sucesso!${NC}"
    echo -e "${CYAN}?? Verifique a pasta 'screenshots/' para as imagens${NC}"
else
    echo ""
    echo -e "${RED}? Erro ao capturar screenshots${NC}"
fi
