# Review: Backend ? Resumes feature

Resumo das mudanças:

- Migrações: `create_resumes_table`, `add_role_to_users_table`.
- Model: `App\Models\Resume` (`$fillable`, `$casts`).
- Policy: `App\Policies\ResumePolicy` (admin/dono).
- Requests: `StoreResumeRequest`, `UpdateResumeRequest` (validações para JSON e campos repetitivos).
- Controller: `App\Http\Controllers\Api\ResumeController` (index respeita role; store/update/show/destroy com autorização).
- Seeder: cria `Super Admin (admin@sistema.com)` e 5 usuários com currículos de exemplo.

Commits: veja `main` branch (commit `53ffff4` contém essas alterações).

Checklist de revisão rápida:

- [ ] A migration `create_resumes_table` tem os campos solicitados e constraints adequadas? (user_id fk, json fields).
- [ ] `Resume` model tem `$casts` corretos para JSON fields?
- [ ] `ResumePolicy` reflete as regras de acesso (admin/dono)?
- [ ] Requests validam os subcampos esperados (ex: `experience.*.company`, `licenses.*.issued_at`)?
- [ ] `DatabaseSeeder` cria credenciais seguras para testes (senha padrão `password` é intencional para desenvolvimento)?
- [ ] Alguma preocupação ao rodar `php artisan migrate` e `php artisan db:seed` em ambiente de desenvolvimento?

Se estiver OK, responda aqui que posso executar as migrations e seeders dentro do container backend.
