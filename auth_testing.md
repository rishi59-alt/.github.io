# Auth Testing Playbook (CHESS app)

The app supports TWO auth methods that resolve to a unified user identity:
1. Email + password (JWT bearer token in localStorage as `chess_token`)
2. Emergent Managed Google OAuth (httpOnly `session_token` cookie)

Anonymous progress uses `X-Client-Id` header. On login/register/Google, anonymous progress is MERGED into the user account.

## Collections
- `users`: { user_id (custom UUID 'user_xxx'), email, name, picture, password_hash?(email users only), auth_provider, created_at }
- `user_sessions`: { user_id, session_token, expires_at, created_at }  (Google sessions)
- `progress`: keyed by `owner_id` (either a user_id when authed, or the anonymous X-Client-Id)

## Email/Password quick test (curl)
```bash
BASE=http://localhost:8001/api
# register
curl -s -X POST $BASE/auth/register -H 'Content-Type: application/json' \
  -d '{"email":"a@b.com","password":"secret12","name":"Ada"}'
# login
curl -s -X POST $BASE/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"a@b.com","password":"secret12"}'
# me (use returned token)
curl -s $BASE/auth/me -H 'Authorization: Bearer <TOKEN>'
```

## Google session test (simulate) — create user + session directly
```bash
mongosh "$MONGO_URL" --eval '
var db = db.getSiblingDB("'"$DB_NAME"'");
var uid = "user_"+Date.now();
var tok = "test_session_"+Date.now();
db.users.insertOne({user_id:uid,email:"g."+Date.now()+"@example.com",name:"Google Test",picture:"",auth_provider:"google",created_at:new Date()});
db.user_sessions.insertOne({user_id:uid,session_token:tok,expires_at:new Date(Date.now()+7*24*3600*1000),created_at:new Date()});
print("session_token: "+tok);
'
```
Then: `curl -s http://localhost:8001/api/auth/me -H 'Authorization: Bearer <session_token>'`
Or browser: set cookie `session_token` and load the app.

## Browser cookie test
```python
await page.context.add_cookies([{
  "name": "session_token", "value": "<TOKEN>",
  "domain": "<preview-domain>", "path": "/",
  "httpOnly": True, "secure": True, "sameSite": "None"}])
```

## Checklist
- [ ] Register/login returns JWT + user; /auth/me returns user with Bearer token
- [ ] Google session exchange creates user + session, sets cookie, /auth/me works via cookie
- [ ] Anonymous progress merges into the account on first auth (XP/completed items carry over)
- [ ] Progress endpoints prefer the authenticated user over X-Client-Id
- [ ] Logout clears cookie/session; /auth/me returns 401 afterwards

## Notes
- Same-origin: frontend and /api share the preview origin, so cookies work without CORS origin allowlisting.
- There is a DEV email/password bypass user for testing (see /app/memory/test_credentials.md). Remove before production if desired.
