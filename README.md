# Projeto Laravel React

Repositório para o projeto fullstack com backend em Laravel (Sanctum) e frontend em React + Vite + MUI.

## Visão geral

- Backend: Laravel 12 com Sanctum para autenticação (services rodando via Docker).
- Frontend: Vite + React + TypeScript + Material UI.
- Docker Compose inclui serviços para backend, frontend, MySQL e phpMyAdmin.

## Campos e formatos do currículo

- Data de nascimento: salva no banco em `birth_date` e exibida no preview.
- Períodos de experiência e educação: usar formato MM/AAAA.
- Telefone: máscara no frontend no formato (99) 99999-9999.

## Início rápido (desenvolvimento)

Pré-requisitos: Docker e Docker Compose instalados.

1. Suba os serviços:

   docker compose up --build

2. Frontend (HMR): http://localhost:3000/
3. Backend (API): verifique `docker-compose.yml` para mapeamento de portas (geralmente `:8000` ou conforme configuração).

## Testes


  docker compose exec backend sh -c "cd backend && composer install && php artisan test"


  docker compose exec frontend sh -c "cd frontend && npm ci && npm run build"

## GitHub Actions

Inclui um workflow básico (`.github/workflows/ci.yml`) que roda os testes do backend (PHPUnit) e faz build do frontend em push e PR.

## Contribuindo

Sinta-se à vontade para abrir issues ou pull requests. Para mudanças significativas, abra uma issue primeiro para discutir o plano.


## Screenshots

### 1. Login
![Login](screenshots/01_01_login_page_2026-02-05T1748.png)

### 2. Login preenchido
![Login preenchido](screenshots/02_02_login_preenchido_2026-02-05T1736.png)

### 3. Dashboard
![Dashboard](screenshots/03_03_dashboard_home_2026-02-05T1736.png)

### 4. Lista de usuários
![Lista de usuários](screenshots/04_04_lista_usuarios_2026-02-05T1721.png)

### 5. Perfil do usuário
![Perfil do usuário](screenshots/05_05_perfil_usuario_2026-02-05T1721.png)

### 6. Edição de currículo
![Edição de currículo](screenshots/06_06_edicao_curriculo_2026-02-05T1748.png)

### 7. Lista de currículos
![Lista de currículos](screenshots/07_07_lista_curriculo_2026-02-05T1721.png)

### 8. Preview (scrolled)
![Preview scrolled](screenshots/08_08_preview_scrolled_2026-02-05T1748.png)

Feito com ?? por carlinhoanc.
