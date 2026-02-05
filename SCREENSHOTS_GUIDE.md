# ?? Guia de Captura de Telas - Projeto Laravel + React

## ?? Índice
1. [Instalação e Configuração](#instalação-e-configuração)
2. [Opção 1: Script Python (Automático)](#opção-1-script-python-automático)
3. [Opção 2: Captura Manual (Passo a Passo)](#opção-2-captura-manual-passo-a-passo)
4. [Estrutura de Screenshots](#estrutura-de-screenshots)
5. [Credenciais](#credenciais)

---

## ?? Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- Docker e Docker Compose rodando
- Navegador Chrome/Chromium instalado

### Verificar se containers estão rodando
```bash
docker-compose ps
```

Você deve ver:
- ? `laravel_app` (Backend) - Port 8000
- ? `react_app` (Frontend) - Port 3000
- ? `mysql_db` - Port 3306

Se não estiverem rodando:
```bash
docker-compose up -d
```

---

## ?? Opção 1: Script Python (Automático)

### 1?? Instalar dependências
```bash
pip install playwright
playwright install
```

### 2?? Executar o script
```bash
python screenshots_automation.py
```

### 3?? O que o script faz
? Faz login com `admin@sistema.com` / `password123`  
? Navega para página de Usuários  
? Acessa o Perfil do usuário  
? Acessa Lista de Currículos  
? Abre um currículo para edição  
? Clica em "Pré-visualizar"  
? Captura Opção 1 (com sidebar)  
? Captura Opção 2 (sem sidebar)  
? Scroll e visualizações adicionais  

### 4?? Onde as screenshots são salvas
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

## ??? Opção 2: Captura Manual (Passo a Passo)

Se preferir fazer manualmente para melhor controle, siga este guia:

### Passo 1: Acessar a Aplicação
1. Abra o navegador
2. Acesse: `http://localhost:3000`
3. **Screenshot 1**: Capturar a página de login
   - Use: `Windows + Shift + S` (Windows) ou `Cmd + Shift + 4` (Mac)
   - Salve como: `01_login_page.png`

### Passo 2: Fazer Login
1. Preencha o email: `admin@sistema.com`
2. Preencha a senha: `password123`
3. **Screenshot 2**: Capturar formulário preenchido
   - Salve como: `02_login_preenchido.png`
4. Clique em "Entrar" ou "Login"
5. Aguarde carregar

### Passo 3: Dashboard após Login
1. **Screenshot 3**: Capturar o dashboard/home
   - Salve como: `03_dashboard_home.png`

### Passo 4: Acessar Usuários
1. Procure no menu lateral ou superior por "Usuários"
2. Clique em "Usuários"
3. Aguarde a página carregar
4. **Screenshot 4**: Capturar lista de usuários
   - Salve como: `04_lista_usuarios.png`

### Passo 5: Acessar Perfil
1. Procure pelo menu do usuário (avatar, nome ou "Perfil")
2. Clique em "Perfil" ou similar
3. Aguarde carregar
4. **Screenshot 5**: Capturar página de perfil
   - Salve como: `05_perfil_usuario.png`

### Passo 6: Acessar Currículos
1. Procure no menu por "Meus Currículos" ou "Currículos"
2. Clique para acessar a lista
3. Aguarde carregar
4. **Screenshot 6**: Capturar lista de currículos
   - Salve como: `06_lista_curriculos.png`

### Passo 7: Abrir um Currículo
1. Clique no primeiro currículo da lista ou em um botão "Editar"
2. A página de edição será carregada
3. **Screenshot 7**: Capturar página de edição
   - Salve como: `07_edicao_curriculo.png`

### Passo 8: Abrir Modal de Pré-visualização
1. Clique em "Pré-visualizar" ou no ícone ???
2. Um modal será aberto
3. **Screenshot 8**: Capturar modal de preview
   - Salve como: `08_preview_modal.png`

### Passo 9: Capturar Opção 1 (Com Sidebar)
1. Clique no botão "Opção 1" no topo do modal
2. A visualização mostrará o currículo com sidebar à esquerda
3. **Screenshot 9**: Capturar visualização Opção 1
   - Salve como: `09_preview_opcao1_sidebar.png`

### Passo 10: Capturar Opção 2 (Sem Sidebar)
1. Clique no botão "Opção 2"
2. A visualização mudará para full-width sem sidebar
3. **Screenshot 10**: Capturar visualização Opção 2
   - Salve como: `10_preview_opcao2_fullwidth.png`

### Passo 11: Scroll e Visualizações Adicionais
1. Faça scroll para baixo no modal para ver mais conteúdo
2. **Screenshot 11**: Capturar após scroll
   - Salve como: `11_preview_scrolled.png`

---

## ?? Estrutura de Screenshots

Organize as screenshots em uma pasta assim:

```
projeto/
??? screenshots/
?   ??? 01_login_page.png
?   ??? 02_login_preenchido.png
?   ??? 03_dashboard_home.png
?   ??? 04_lista_usuarios.png
?   ??? 05_perfil_usuario.png
?   ??? 06_lista_curriculos.png
?   ??? 07_edicao_curriculo.png
?   ??? 08_preview_modal.png
?   ??? 09_preview_opcao1_sidebar.png
?   ??? 10_preview_opcao2_fullwidth.png
?   ??? 11_preview_scrolled.png
??? SCREENSHOTS_GUIDE.md (este arquivo)
```

---

## ?? Credenciais

### Usuário Admin (Recomendado)
```
Email: admin@sistema.com
Senha: password123
```

### Outros usuários (se necessário)
- Você pode criar novos usuários através do painel administrativo
- Ou usar usuários existentes no banco de dados

---

## ?? O que Você Deve Ver em Cada Screenshot

| # | Tela | O que Esperar |
|---|------|--------------|
| 1?? | Login Page | Formulário com campos de email e senha |
| 2?? | Login Preenchido | Formulário preenchido com credenciais |
| 3?? | Dashboard | Home page após login com menu lateral |
| 4?? | Lista Usuários | Tabela com lista de usuários do sistema |
| 5?? | Perfil Usuário | Dados do perfil do usuário admin |
| 6?? | Lista Currículos | Cartões/lista de currículos disponíveis |
| 7?? | Edição Currículo | Formulário de edição com todos os campos |
| 8?? | Preview Modal | Modal de pré-visualização aberto |
| 9?? | Opção 1 Sidebar | Currículo com sidebar azul à esquerda |
| ?? | Opção 2 Full-width | Currículo em full-width sem sidebar |
| 1??1?? | Scrolled | Visualização após scroll mostrando mais conteúdo |

---

## ?? Troubleshooting

### Script não inicia
```bash
# Verificar Python
python --version

# Reinstalar Playwright
pip install --upgrade playwright
playwright install chromium
```

### Página não carrega no script
- Aumentar timeout: Edite `screenshots_automation.py` e aumente o valor em `wait_for_timeout()`
- Verificar se Docker está rodando: `docker-compose ps`

### Docker não está rodando
```bash
docker-compose up -d
```

### Credenciais incorretas
- Verifique no banco de dados ou crie novo usuário:
```bash
docker-compose exec backend php artisan tinker
# Dentro do tinker:
\App\Models\User::where('email', 'admin@sistema.com')->first()
```

---

## ?? Recursos Adicionais

- [Playwright Documentation](https://playwright.dev/)
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Docker Documentation](https://docs.docker.com/)

---

## ?? Notas

- Screenshots são salvos com timestamp para evitar conflitos
- Se rodar o script múltiplas vezes, novas screenshots serão criadas
- Pasta `screenshots/` é criada automaticamente se não existir
- Configure resolução do navegador conforme necessário (padrão: 1920x1080)

---

**Última atualização:** Fevereiro 2026  
**Versão:** 1.0
