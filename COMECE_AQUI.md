# ?? RESUMO - Scripts de Captura de Telas Criados

## ?? Arquivos Criados

```
? SCREENSHOTS_README.md          ?? README com início rápido
? SCREENSHOTS_GUIDE.md           ?? Guia manual passo a passo
? INDEX_SCREENSHOTS.md           ?? Índice completo (LEIA ISTO PRIMEIRO!)
? screenshots_automation.py      ?? Script Python (RECOMENDADO)
? screenshots_automation.js      ?? Script Node.js (alternativa)
? requirements.txt               ?? Dependências Python
? package-screenshots.json       ?? Dependências Node.js
? run_screenshots.ps1            ?? Executor Windows (PowerShell)
? run_screenshots.sh             ?? Executor Linux/Mac (Bash)
```

---

## ?? O QUE FAZER AGORA?

### 1?? Leia o Índice
```
?? Abra: INDEX_SCREENSHOTS.md
```

### 2?? Escolha um Método

#### Opção A: Automático com Python ? (Recomendado)
```powershell
# Windows
.\run_screenshots.ps1

# Linux/Mac
./run_screenshots.sh
```

#### Opção B: Automático com Node.js
```bash
npm install --save-dev puppeteer
node screenshots_automation.js
```

#### Opção C: Manual (Passo a Passo)
```
?? Abra: SCREENSHOTS_GUIDE.md
```

---

## ?? Estrutura de Saída

Os screenshots serão salvos em:
```
projeto/screenshots/
??? 01_login_page_*.png
??? 02_login_preenchido_*.png
??? 03_dashboard_home_*.png
??? 04_lista_usuarios_*.png
??? 05_perfil_usuario_*.png
??? 06_lista_curriculos_*.png
??? 07_edicao_curriculo_*.png
??? 08_preview_modal_*.png
??? 09_preview_opcao1_sidebar_*.png
??? 10_preview_opcao2_fullwidth_*.png
??? 11_preview_scrolled_*.png
```

---

## ?? Início Rápido

### Windows (Recomendado)
```powershell
# 1. Abra PowerShell na pasta do projeto
# 2. Digite:
.\run_screenshots.ps1

# O script irá:
# ? Verificar Python
# ? Verificar Docker
# ? Instalar Playwright (se necessário)
# ? Executar automação
# ? Salvar screenshots em pasta
```

### Linux/Mac
```bash
# 1. Abra terminal na pasta do projeto
# 2. Digite:
chmod +x run_screenshots.sh
./run_screenshots.sh

# Mesmo fluxo do Windows
```

### Manual (Qualquer SO)
```bash
# Instalar dependências
pip install -r requirements.txt
playwright install

# Executar
python screenshots_automation.py
```

---

## ? Pré-requisitos

```
? Docker rodando
   docker-compose ps

? Python 3.8+ (para método Python)
   python --version

? Node.js 16+ (para método Node.js)
   node --version
```

Se algum não está instalado, execute:
```bash
docker-compose up -d
```

---

## ?? Credenciais

```
Email: admin@sistema.com
Senha: password123
```

---

## ?? O Que Será Capturado

| # | Tela | Descrição |
|---|------|-----------|
| 1?? | Login Page | Página de login vazia |
| 2?? | Login Preenchido | Formulário com credenciais |
| 3?? | Dashboard | Home após login |
| 4?? | Lista Usuários | Tabela de usuários |
| 5?? | Perfil Usuário | Página de perfil |
| 6?? | Lista Currículos | Cards/tabela de currículos |
| 7?? | Edição Currículo | Formulário de edição |
| 8?? | Modal Preview | Modal de visualização |
| 9?? | Opção 1 | Com sidebar azul |
| ?? | Opção 2 | Sem sidebar (fullwidth) |
| 1??1?? | Scrolled | Após scroll para baixo |

---

## ?? Como Usar

### Método 1: Automático (Mais Fácil)
1. Abra PowerShell/Terminal na pasta do projeto
2. Execute `.\run_screenshots.ps1` (Windows) ou `./run_screenshots.sh` (Mac/Linux)
3. Aguarde o script executar
4. Acesse pasta `screenshots/` para ver as imagens

### Método 2: Manual (Mais Controle)
1. Abra [SCREENSHOTS_GUIDE.md](SCREENSHOTS_GUIDE.md)
2. Siga as instruções passo a passo
3. Tire prints em cada etapa
4. Salve com os nomes sugeridos

---

## ?? Troubleshooting

### Erro: "Python não encontrado"
```bash
# Reinstale Python de https://www.python.org/
python --version
```

### Erro: "Docker não está rodando"
```bash
docker-compose up -d
docker-compose ps
```

### Erro: "Playwright não instalado"
```bash
pip install --upgrade playwright
playwright install
```

---

## ?? Comandos Úteis

```bash
# Verificar Docker
docker-compose ps

# Visualizar logs
docker-compose logs backend

# Reiniciar tudo
docker-compose restart

# Instalar dependências Python
pip install -r requirements.txt --upgrade

# Executar script Python
python screenshots_automation.py

# Executar script Node.js
node screenshots_automation.js
```

---

## ?? Documentos Importantes

1. **[INDEX_SCREENSHOTS.md](INDEX_SCREENSHOTS.md)** ? Leia isto primeiro
2. **[SCREENSHOTS_README.md](SCREENSHOTS_README.md)** ? Para automação
3. **[SCREENSHOTS_GUIDE.md](SCREENSHOTS_GUIDE.md)** ? Para captura manual

---

## ? Features do Script

? Automação completa do login até preview  
? 11 screenshots em sequência  
? Timestamps automáticos em cada arquivo  
? Suporte Windows, Mac e Linux  
? Disponível em Python e Node.js  
? Logs detalhados de cada etapa  
? Navegador visível para acompanhar  
? Tratamento de erros robusto  
? Fácil customização  

---

## ?? Próximos Passos

### Agora você pode:

1. ? Executar o script automático
2. ? Capturar screenshots de todo o fluxo
3. ? Usar as imagens em documentação
4. ? Criar guia visual do projeto
5. ? Compartilhar com stakeholders

---

## ?? Dicas

- ?? Execute com navegador visível para ver o fluxo acontecer
- ??? Screenshots são salvos com timestamp (não há conflitos)
- ?? Altere resolução editando os scripts (padrão: 1920x1080)
- ?? Execute múltiplas vezes para gerar diferentes screenshots
- ?? Use para criar documentação visual do projeto

---

## ?? Suporte Rápido

```
Problema?
  ?
1. Verifique Docker: docker-compose ps
  ?
2. Reinstale deps: pip install -r requirements.txt --upgrade
  ?
3. Execute novamente: python screenshots_automation.py
```

---

**? Tudo pronto! Escolha um método e começe a capturar! ?**

---

*Última atualização: Fevereiro 2026*  
*Versão: 1.0*
