# ?? Guia Completo de Captura de Telas

## ?? Arquivos Criados

### ?? Documentação
- **`SCREENSHOTS_README.md`** - README principal com início rápido
- **`SCREENSHOTS_GUIDE.md`** - Guia detalhado de captura manual (passo a passo)

### ?? Scripts Python
- **`screenshots_automation.py`** - Script Python com automação completa (RECOMENDADO)
- **`requirements.txt`** - Dependências Python
- **`run_screenshots.ps1`** - Executar script no Windows (PowerShell)
- **`run_screenshots.sh`** - Executar script no Linux/Mac (Bash)

### ?? Scripts Node.js
- **`screenshots_automation.js`** - Script Node.js com Puppeteer (alternativa)
- **`package-screenshots.json`** - Dependências Node.js

---

## ?? Início Rápido

### Opção 1: Python (Recomendado) ?

#### Windows
```powershell
.\run_screenshots.ps1
```

#### Linux/Mac
```bash
chmod +x run_screenshots.sh
./run_screenshots.sh
```

#### Manual
```bash
pip install -r requirements.txt
playwright install
python screenshots_automation.py
```

---

### Opção 2: Node.js

#### Instalação
```bash
npm install --save-dev puppeteer
```

#### Execução
```bash
node screenshots_automation.js
```

---

## ?? Credenciais

```
Email: admin@sistema.com
Senha: password123
```

---

## ? O que Será Capturado

1. ?? **Página de Login**
2. ?? **Formulário Preenchido**
3. ?? **Dashboard/Home**
4. ?? **Lista de Usuários**
5. ?? **Perfil do Usuário**
6. ?? **Lista de Currículos**
7. ?? **Edição de Currículo**
8. ?? **Modal de Pré-visualização**
9. ?? **Opção 1 (Com Sidebar)**
10. ?? **Opção 2 (Sem Sidebar)**
11. ?? **Scroll e Visualizações**

**Total: 11 screenshots** com timestamp automático

---

## ?? Saída

As imagens serão salvas em:
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

## ?? Comparação Python vs Node.js

| Aspecto | Python | Node.js |
|--------|--------|---------|
| **Dependências** | Leve | Mais pesado |
| **Performance** | Rápido | Rápido |
| **Facilidade** | ????? | ???? |
| **Comunidade** | Grande | Maior |
| **Setup** | Simples | Simples |

**Recomendação:** Use Python para simplicidade

---

## ??? Pré-requisitos

- ? Docker rodando (`docker-compose up -d`)
- ? Python 3.8+ OU Node.js 16+
- ? Navegador Chrome/Chromium

---

## ?? Documentação Detalhada

Para captura **manual passo a passo**, leia:
?? **[SCREENSHOTS_GUIDE.md](SCREENSHOTS_GUIDE.md)**

Para usar **automação com Python**, leia:
?? **[SCREENSHOTS_README.md](SCREENSHOTS_README.md)**

---

## ?? Troubleshooting

### "Playwright não encontrado"
```bash
pip install --upgrade playwright
playwright install
```

### "Docker não está rodando"
```bash
docker-compose up -d
```

### "Python/Node não encontrado"
- Instale de https://www.python.org/ ou https://nodejs.org/
- Reinicie o terminal

---

## ?? Customizações

### Alterar resolução (Python)
Edite `screenshots_automation.py`:
```python
context = await browser.new_context(viewport={"width": 2560, "height": 1440})
```

### Alterar resolução (Node.js)
Edite `screenshots_automation.js`:
```javascript
await page.setViewport({ width: 2560, height: 1440 });
```

### Adicionar mais screenshots
Edite qualquer um dos scripts e adicione:
```python
# Python
await self.take_screenshot(page, "seu_nome")

# Node.js
await this.takeScreenshot(page, 'seu_nome');
```

---

## ?? Estrutura do Projeto

```
projeto/
??? SCREENSHOTS_README.md         ? Leia isto para automação
??? SCREENSHOTS_GUIDE.md          ? Leia isto para manual
??? INDEX_SCREENSHOTS.md          ? Este arquivo
??? screenshots_automation.py      ? Script Python ?
??? screenshots_automation.js      ? Script Node.js
??? requirements.txt              ? Deps Python
??? package-screenshots.json      ? Deps Node.js
??? run_screenshots.ps1           ? Executar no Windows
??? run_screenshots.sh            ? Executar no Linux/Mac
??? screenshots/                  ? Pasta de saída (criada automaticamente)
    ??? 01_login_page_*.png
    ??? 02_login_preenchido_*.png
    ??? ... (mais 9 screenshots)
```

---

## ? Features

? Automação completa do login até visualização  
? Captura em alta resolução (1920x1080)  
? Timestamp automático em cada arquivo  
? Suporte Windows, Mac, Linux  
? Python e Node.js  
? Logs detalhados  
? Tratamento de erros robusto  
? Navegador visível durante execução  
? Fácil customização  

---

## ?? Fluxo Completo

```
1. Login com admin@sistema.com
   ?
2. Navegar para Usuários
   ?
3. Acessar Perfil
   ?
4. Ir para Lista de Currículos
   ?
5. Abrir um Currículo
   ?
6. Clicar em Pré-visualizar
   ?
7. Capturar Opção 1 (com sidebar)
   ?
8. Capturar Opção 2 (sem sidebar)
   ?
9. Fazer scroll e capturar
   ?
? Salvar 11 screenshots
```

---

## ?? Suporte

Qualquer problema?

1. Verifique Docker: `docker-compose ps`
2. Reinstale deps: `pip install -r requirements.txt --upgrade`
3. Limpe cache do navegador
4. Execute novamente

---

**Última atualização:** Fevereiro 2026  
**Versão:** 1.0

---

## ?? Próximos Passos

1. ? Escolha Python ou Node.js
2. ? Execute o script
3. ? Verifique pasta `screenshots/`
4. ? Use as imagens para documentação

**Bom trabalho! ??**
