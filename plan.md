# plan.md

## 1) Objectives
- Deliver a premium Gen‑Z chess-learning web app (“Chess”) on FARM stack with a **best-in-class interactive chessboard** at the center.
- Ship an MVP with: Home, Openings, Lessons, Lesson Player, Tactics/Tricks, Puzzles (daily), Progress dashboard, Search/Filter, Sandbox board.
- Use scalable MongoDB content models seeded with a solid starter set (listed openings + ~15 lessons + ~12 tactics/puzzles).
- Add auth (Google via Emergent Managed Google Auth + email/password JWT) after the core learning loop is proven.

---

## 2) Implementation Steps

### Phase 1 — Core Workflow POC (isolation-first)
**Goal:** Prove the make-or-break loop works: chessboard + chess.js legality + step/tactic validation + notation + smooth UX.

**Web research (best practices / known pitfalls)**
- Verify current recommended integration patterns for **react-chessboard + chess.js**, SAN generation, promotion handling, mobile drag behavior.
- Verify Emergent Managed Google Auth flow requirements (redirect/callback expectations) for later phase.

**POC scope (no auth, minimal UI)**
- Create a minimal React page with:
  - `react-chessboard` board
  - `chess.js` instance for rules
  - Features: drag-drop, legal move enforcement, highlight legal moves, last-move highlight, move history in SAN, undo, reset, flip, captured pieces.
- Implement **tactic validator**:
  - Load one tactic position via FEN + side to move.
  - Validate user move vs solution line (SAN/UCI normalized), show ✅/❌, allow retry, then auto-play continuation.
- Implement **lesson-step player validator**:
  - Steps with (FEN, prompt, expected move(s), explanation).
  - Next/Prev, restart, progress bar.

**Exit gate (must pass before Phase 2)**
- 100% legal-move enforcement; SAN history correct; undo/reset stable; mobile usable; tactic/lesson move validation reliable.

**User stories (Phase 1)**
1. As a user, I can drag a piece and only legal moves are accepted so I don’t learn illegal chess.
2. As a user, I can undo/reset/flip the board so I can explore lines quickly.
3. As a user, I can attempt a tactic and instantly know if my move is correct.
4. As a user, I can replay the solution line to understand why the tactic works.
5. As a user, I can step through a lesson with “your turn” checkpoints and clear feedback.

---

### Phase 2 — V1 App Development (MVP around proven core, still no auth)
**Frontend (React + Tailwind + shadcn/ui + framer-motion)**
- App shell: sticky nav, dark-mode default + toggle, responsive layout, global search/filter.
- Pages:
  - Home (hero + decorative interactive board + CTAs + openings/lessons/tactics previews)
  - Openings list + Opening detail lesson page (interactive move-through)
  - Lessons list + Lesson Player (board left, explanation right)
  - Tactics/Tricks trainer (interactive “find best move”) + Puzzles (daily)
  - Progress dashboard (local/anonymous progress for now)
  - Sandbox board (free play)
- UI identity: black/white chessboard motif background (subtle, animated), premium monochrome with minimal accent.

**Backend (FastAPI + MongoDB)**
- Data models/collections (expandable):
  - `openings` (name, side, difficulty, description, recommended_for, mainline_moves_SAN, tags)
  - `lessons` (title, difficulty, est_time, description, steps[{fen,prompt,expected_moves,explain}])
  - `tactics` (theme, difficulty, fen, side_to_move, solution_line, explain)
  - `daily_puzzle` (date, tactic_id)
- API routes under `/api`:
  - `GET /openings`, `GET /openings/{id}`
  - `GET /lessons`, `GET /lessons/{id}`
  - `GET /tactics?theme=&difficulty=`, `GET /tactics/{id}`
  - `GET /puzzles/daily`
  - `GET /search?q=&filters=`
- Seed MongoDB with:
  - all listed openings (real SAN mainlines)
  - ~15 lessons (mapped to the provided list)
  - ~12 tactics/puzzles (mapped to provided themes + checkmates/endgames starter)

**Gamification (unauthenticated v1)**
- Local progress store (browser) for: xp, level, streak, accuracy, completed items.
- XP gain animations, level-up toast, achievements list (local).

**Phase 2 end-to-end testing (1 full pass)**
- Navigate all pages; verify board works everywhere; verify API content loads; verify search/filter; verify daily puzzle; verify progress updates.

**User stories (Phase 2)**
1. As a user, I can browse openings and start an interactive opening lesson from a card.
2. As a user, I can complete a lesson with step-by-step positions and checkpoints.
3. As a user, I can train tactics by making moves on the board and getting instant feedback.
4. As a user, I can view a progress dashboard showing XP, level, streak, and accuracy.
5. As a mobile user, I can comfortably use the chessboard and swipe through content without layout breaking.

---

### Phase 3 — Accounts + Cloud Progress (Auth + persistence)
**Auth (added after v1 is stable)**
- Email/password:
  - `POST /api/auth/register`, `POST /api/auth/login` (bcrypt + JWT)
- Google:
  - Integrate Emergent Managed Google Auth; backend endpoint to verify token / create user.
- Frontend auth UI: login/register modal/page + Google button.

**User data + persistence**
- Collections:
  - `users` (profile, created_at)
  - `progress` (user_id, xp, level, streak, accuracy, completed_openings, completed_lessons, solved_tactics, achievements, last_activity)
- Migration: on first login, offer “merge local progress into account”.

**Phase 3 testing (1 full pass)**
- Register/login/logout; Google sign-in; token refresh handling; verify progress persists across devices.

**User stories (Phase 3)**
1. As a user, I can sign up with email/password so my progress is saved.
2. As a user, I can sign in with Google in one tap.
3. As a user, I can resume lessons/tactics on another device with the same progress.
4. As a user, I can merge my existing local progress into my new account.
5. As a user, I stay logged in securely and can log out anytime.

---

### Phase 4 — Polish + Scale Content + Quality
- Expand content volume (more lines/variations, more puzzles, more endgames) using the same schemas.
- Improve learning UX: spaced repetition for tactics, “review mistakes”, bookmarks.
- Performance: code splitting, board rendering optimization, API caching.
- Accessibility + QA: keyboard navigation for key flows, contrast checks.

**User stories (Phase 4)**
1. As a user, I can review tactics I previously missed to fix weaknesses.
2. As a user, I can filter content by theme/difficulty to train intentionally.
3. As a user, I can take a daily challenge and keep a streak alive.
4. As a user, I can save/bookmark an opening line to revisit later.
5. As a user, the app stays fast and smooth even as content grows.

---

## 3) Next Actions
1. Run web research on react-chessboard + chess.js integration and SAN/validation approach.
2. Build Phase 1 POC (board + tactic + lesson-step validation) and do not proceed until it’s stable.
3. Define/seed the starter MongoDB content set (openings + lessons + tactics) in parallel with Phase 2 scaffolding.
4. Build Phase 2 V1 pages and wire all API endpoints; implement local progress + gamification.
5. After V1 passes E2E testing, implement Phase 3 auth + cloud progress.

---

## STATUS LOG
- ✅ Phase 1 COMPLETE (POC validated in browser): react-chessboard v5 (`options` prop API, object-arg callbacks) + chess.js@1.4.0.
  - Legal move enforcement works (illegal moves rejected), SAN history correct, undo/reset/flip, captured-piece tracking, legal-move highlight + last-move highlight.
  - Tactic validator (clone-test SAN vs solution) gives ✅/❌ + explanation.
  - Lesson-step player advances board + progress bar + prev/next/restart.
  - Key API notes for build: `<Chessboard options={{ position, onPieceDrop:({sourceSquare,targetSquare})=>bool, onSquareClick:({square,piece}), boardOrientation, squareStyles, animationDurationInMs, id }} />`. targetSquare can be null on off-board drop.
- ⏳ Phase 2 IN PROGRESS.

## STATUS LOG
- ✅ Phase 1 COMPLETE (POC validated in browser): react-chessboard v5 + chess.js@1.4.0.
- ✅ Phase 2 COMPLETE + tested 100% (iteration_1): all pages, interactive board, 14 openings / 16 lessons / 12 tactics (seeded + chess.js-validated), daily puzzle, gamification, search/filter, dark+light, responsive.
- ✅ Phase 3 COMPLETE + tested (iteration_2, backend 48/48): email+password (JWT) AND Emergent Google OAuth -> unified user; anonymous X-Client-Id progress merges into account on first auth; progress persists across sessions/devices via bearer token.
  - NOTE: Auth is BEARER-token based (ingress overrides CORS so credentialed cookies fail cross-origin; bearer works everywhere). Dev test account: player@chess.dev / chessgg123. See /app/auth_testing.md.

## 4) Success Criteria
- Core board UX: legal moves enforced; smooth drag/drop on mobile; history/undo/reset/flip/captures all reliable.
- Lessons/tactics: move validation is correct; explanations display; step navigation never desyncs board state.
- Content: all listed openings available with real mainlines; ~15 lessons and ~12 tactics/puzzles seeded and playable.
- UX: dark-mode premium chessboard aesthetic; responsive across devices; subtle animations don’t hurt performance.
- Progress: XP/level/streak/accuracy update correctly; after auth, progress persists across sessions/devices.
