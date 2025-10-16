# 9TD PHP API Scaffold

Routes (prefix `/api`):
- `POST /auth/register` — body: { username, email, password }
- `POST /auth/login` — body: { usernameOrEmail, password }
- `GET /tasks` — header: Authorization: Bearer <token>
- `POST /tasks`
- `PUT /tasks/{id}`
- `DELETE /tasks/{id}`
- `GET /messages` (direct messages)
- `POST /messages`

Configure `.env` and import `src/schema.sql`. Minimal, secure-ish defaults (password hashing, token issuing).
