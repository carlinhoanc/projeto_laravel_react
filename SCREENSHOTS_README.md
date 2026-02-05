# ?? Captura de Telas - Documentação

## ?? Objetivo
Gerar documentação visual do projeto mostrando o fluxo completo:
- ? Login
- ? Acesso a Usuários
- ? Perfil do Usuário
- ? Lista de Currículos
- ? Edição de Currículo
- ? Visualização (Opção 1 e Opção 2)

## ?? Início Rápido

### Opção A: Automático (Recomendado)

#### Windows (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\run_screenshots.ps1
```

#### Linux/Mac (Bash)
```bash
chmod +x run_screenshots.sh
./run_screenshots.sh
```

### Opção B: Manual

```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Instalar navegador
playwright install

# 3. Executar script
python screenshots_automation.py
```

---

## ?? Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `screenshots_automation.py` | Script Python com automação completa |
| `SCREENSHOTS_GUIDE.md` | Guia detalhado de captura manual |
| `requirements.txt` | Dependências Python |
| `run_screenshots.ps1` | Script de execução para Windows |
| `run_screenshots.sh` | Script de execução para Linux/Mac |

---

## ? Pré-requisitos

- **Python 3.8+**
  ```bash
  python --version
  ```

- **Docker e Docker Compose rodando**
  ```bash
  docker-compose ps
  ```

- **Browsers instalados** (o script instala automaticamente)

---

## ?? Credenciais

```
Email: admin@sistema.com
Senha: password123
```

---

## ?? Estrutura de Saída

As screenshots serão salvas em:
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

## ?? Resolução de Problemas

### Erro: "Playwright não encontrado"
```bash
pip install --upgrade playwright
playwright install
```

### Erro: "Docker não está rodando"
```bash
docker-compose up -d
docker-compose ps  # Verificar status
```

### Erro: "Python não encontrado"
- Instale Python de https://www.python.org/
- Reinicie o terminal
- Verifique: `python --version`

### Erro: "Página não carregou"
- Aumente o timeout no script
- Verifique se Docker está saudável
- Limpe o cache do navegador

---

## ?? Customizações

### Alterar Resolução da Janela
Edite `screenshots_automation.py`:
```python
context = await browser.new_context(viewport={"width": 1920, "height": 1080})
```

### Alterar URL Base
Edite `screenshots_automation.py`:
```python
automation = CurriculumScreenshots(base_url="http://seu-dominio.com")
```

### Adicionar Mais Screenshots
Edite a função `run()` em `screenshots_automation.py` e adicione:
```python
await self.take_screenshot(page, "seu_nome_aqui")
```

---

## ?? Logs e Debug

O script mostra logs detalhados:
```
? Screenshot salva: 01_login_page_20260205_120000.png
```

Se ocorrer erro, o script mostrará a traceback completa.

---

## ?? Para Captura Manual

Veja o arquivo `SCREENSHOTS_GUIDE.md` para instruções passo a passo.

---

## ? Features

? Automação completa do fluxo de login até visualização  
? Captura de telas em alta resolução  
? Timestamp automático em cada screenshot  
? Suporte para Windows, Mac e Linux  
? Logs detalhados  
? Tratamento de erros robusto  
? Interface do navegador visível durante execução  
? Fácil customização  

---

## ?? Suporte

Se encontrar problemas:
1. Verifique se Docker está rodando: `docker-compose ps`
2. Verifique logs: `docker-compose logs`
3. Reinstale dependências: `pip install -r requirements.txt --upgrade`
4. Execute novamente

---

**Última atualização:** Fevereiro 2026  
**Versão:** 1.0
