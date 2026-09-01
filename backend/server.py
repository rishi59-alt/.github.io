from fastapi import FastAPI, APIRouter, Header, HTTPException, Query, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import uuid
import logging
import bcrypt
import jwt
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, date, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Chess Learning API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Content loading
# ---------------------------------------------------------------------------
with open(ROOT_DIR / 'content_seed.json', 'r') as f:
    CONTENT = json.load(f)

XP_PER_LEVEL = CONTENT['levels']['xp_per_level']
LEVEL_TITLES = CONTENT['levels']['titles']
ACHIEVEMENTS = CONTENT['achievements']

# ---------------------------------------------------------------------------
# Auth config
# ---------------------------------------------------------------------------
JWT_SECRET = os.environ.get('JWT_SECRET', 'dev-secret-change-me')
JWT_ALG = 'HS256'
JWT_TTL_DAYS = 7
SESSION_TTL_DAYS = 7
EMERGENT_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class RegisterBody(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: Optional[str] = None
    client_id: Optional[str] = None


class LoginBody(BaseModel):
    email: EmailStr
    password: str
    client_id: Optional[str] = None


class SessionBody(BaseModel):
    session_id: str
    client_id: Optional[str] = None


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_jwt(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_TTL_DAYS),
        "type": "jwt",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_jwt(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return payload.get("sub")
    except Exception:
        return None


def public_user(u: dict) -> dict:
    return {
        "user_id": u["user_id"],
        "email": u.get("email"),
        "name": u.get("name"),
        "picture": u.get("picture"),
        "auth_provider": u.get("auth_provider", "email"),
    }


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class TacticAttempt(BaseModel):
    tactic_id: str
    correct: bool


class CompleteItem(BaseModel):
    item_id: str


def strip_id(doc: dict) -> dict:
    if not doc:
        return doc
    doc.pop('_id', None)
    return doc


# ---------------------------------------------------------------------------
# Seeding
# ---------------------------------------------------------------------------
async def seed_content():
    """Idempotently seed static chess content into MongoDB."""
    for o in CONTENT['openings']:
        await db.openings.replace_one({'id': o['id']}, o, upsert=True)
    for l in CONTENT['lessons']:
        await db.lessons.replace_one({'id': l['id']}, l, upsert=True)
    for t in CONTENT['tactics']:
        await db.tactics.replace_one({'id': t['id']}, t, upsert=True)
    logger.info(
        "Seeded %d openings, %d lessons, %d tactics",
        len(CONTENT['openings']), len(CONTENT['lessons']), len(CONTENT['tactics'])
    )


@app.on_event("startup")
async def on_startup():
    await seed_content()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# ---------------------------------------------------------------------------
# Gamification helpers
# ---------------------------------------------------------------------------
def level_title_for(level: int) -> str:
    title = LEVEL_TITLES[0]['title']
    for t in LEVEL_TITLES:
        if level >= t['min']:
            title = t['title']
    return title


def compute_level(xp: int) -> dict:
    level = xp // XP_PER_LEVEL + 1
    xp_into_level = xp % XP_PER_LEVEL
    return {
        "level": level,
        "title": level_title_for(level),
        "xp_into_level": xp_into_level,
        "xp_for_level": XP_PER_LEVEL,
        "xp_to_next": XP_PER_LEVEL - xp_into_level,
    }


def default_progress(owner_id: str) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "owner_id": owner_id,
        "xp": 0,
        "completed_lessons": [],
        "completed_openings": [],
        "solved_tactics": [],
        "streak": 0,
        "last_active": None,
        "tactics_attempts": 0,
        "tactics_correct": 0,
        "created_at": now,
        "updated_at": now,
    }


def apply_streak(progress: dict):
    today = date.today()
    last = progress.get("last_active")
    if last:
        try:
            last_d = date.fromisoformat(last)
        except (ValueError, TypeError):
            last_d = None
    else:
        last_d = None

    if last_d == today:
        pass  # already counted today
    elif last_d == today - timedelta(days=1):
        progress["streak"] = progress.get("streak", 0) + 1
    else:
        progress["streak"] = 1
    progress["last_active"] = today.isoformat()


def enrich_progress(p: dict) -> dict:
    lessons_completed = len(p.get("completed_lessons", []))
    openings_learned = len(p.get("completed_openings", []))
    tactics_solved = len(p.get("solved_tactics", []))
    attempts = p.get("tactics_attempts", 0)
    correct = p.get("tactics_correct", 0)
    accuracy = round((correct / attempts) * 100) if attempts > 0 else 0

    stats = {
        "lessons_completed": lessons_completed,
        "openings_learned": openings_learned,
        "tactics_solved": tactics_solved,
        "streak": p.get("streak", 0),
    }

    achievements = []
    for a in ACHIEVEMENTS:
        metric_val = stats.get(a["metric"], 0)
        achievements.append({
            **a,
            "earned": metric_val >= a["threshold"],
            "current": metric_val,
        })

    level_info = compute_level(p.get("xp", 0))
    total_lessons = len(CONTENT['lessons'])
    total_openings = len(CONTENT['openings'])
    total_tactics = len(CONTENT['tactics'])

    return {
        "owner_id": p["owner_id"],
        "xp": p.get("xp", 0),
        **level_info,
        "streak": p.get("streak", 0),
        "accuracy": accuracy,
        "tactics_attempts": attempts,
        "tactics_correct": correct,
        "stats": {
            **stats,
            "total_lessons": total_lessons,
            "total_openings": total_openings,
            "total_tactics": total_tactics,
            "learning_progress": round(
                ((lessons_completed + openings_learned + tactics_solved) /
                 (total_lessons + total_openings + total_tactics)) * 100
            ) if (total_lessons + total_openings + total_tactics) else 0,
        },
        "completed_lessons": p.get("completed_lessons", []),
        "completed_openings": p.get("completed_openings", []),
        "solved_tactics": p.get("solved_tactics", []),
        "achievements": achievements,
    }


async def get_or_create_progress(owner_id: str) -> dict:
    p = await db.progress.find_one({"owner_id": owner_id})
    if not p:
        p = default_progress(owner_id)
        await db.progress.insert_one(dict(p))
    return strip_id(p)


async def save_progress(p: dict):
    p["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.progress.replace_one({"owner_id": p["owner_id"]}, p, upsert=True)


def recompute_xp(p: dict) -> int:
    """Deterministically recompute XP from completed items (used when merging)."""
    xp = 0
    for lid in p.get("completed_lessons", []):
        lesson = next((l for l in CONTENT['lessons'] if l['id'] == lid), None)
        xp += lesson.get("xp_reward", 50) if lesson else 50
    for oid in p.get("completed_openings", []):
        op = next((o for o in CONTENT['openings'] if o['id'] == oid), None)
        xp += op.get("xp_reward", 100) if op else 100
    xp += 40 * len(p.get("solved_tactics", []))
    return xp


async def merge_anon_into_user(client_id: Optional[str], user_id: str):
    """Merge anonymous per-device progress into the user's account on login."""
    if not client_id or client_id == user_id:
        return
    anon = await db.progress.find_one({"owner_id": client_id})
    if not anon:
        return
    user_p = await db.progress.find_one({"owner_id": user_id})
    if not user_p:
        # Simply re-key the anonymous progress to the user
        anon = strip_id(anon)
        anon["owner_id"] = user_id
        await db.progress.replace_one({"owner_id": user_id}, anon, upsert=True)
    else:
        user_p = strip_id(user_p)
        anon = strip_id(anon)
        user_p["completed_lessons"] = sorted(set(user_p.get("completed_lessons", [])) | set(anon.get("completed_lessons", [])))
        user_p["completed_openings"] = sorted(set(user_p.get("completed_openings", [])) | set(anon.get("completed_openings", [])))
        user_p["solved_tactics"] = sorted(set(user_p.get("solved_tactics", [])) | set(anon.get("solved_tactics", [])))
        user_p["tactics_attempts"] = user_p.get("tactics_attempts", 0) + anon.get("tactics_attempts", 0)
        user_p["tactics_correct"] = user_p.get("tactics_correct", 0) + anon.get("tactics_correct", 0)
        user_p["streak"] = max(user_p.get("streak", 0), anon.get("streak", 0))
        user_p["xp"] = recompute_xp(user_p)
        await save_progress(user_p)
    # Clean up the anonymous doc so it doesn't linger
    await db.progress.delete_one({"owner_id": client_id})


async def resolve_current_user(request: Request) -> Optional[dict]:
    """Resolve the authenticated user from session cookie or Authorization header.

    Accepts either an Emergent session_token (cookie or bearer) or an app JWT (bearer).
    Returns the user document (without _id) or None.
    """
    token = request.cookies.get("session_token")
    if not token:
        auth = request.headers.get("Authorization") or request.headers.get("authorization")
        if auth and auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
    if not token:
        return None

    # 1) Try app JWT
    uid = decode_jwt(token)
    if uid:
        u = await db.users.find_one({"user_id": uid}, {"_id": 0})
        if u:
            return u

    # 2) Try Emergent session token
    sess = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if sess:
        expires_at = sess.get("expires_at")
        if isinstance(expires_at, str):
            try:
                expires_at = datetime.fromisoformat(expires_at)
            except ValueError:
                expires_at = None
        if expires_at and expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at and expires_at < datetime.now(timezone.utc):
            return None
        u = await db.users.find_one({"user_id": sess["user_id"]}, {"_id": 0})
        if u:
            return u
    return None


async def resolve_owner(request: Request, x_client_id: Optional[str]) -> str:
    """Owner id for progress: authenticated user_id if present, else anonymous client id."""
    user = await resolve_current_user(request)
    if user:
        return user["user_id"]
    if not x_client_id:
        raise HTTPException(status_code=400, detail="Missing X-Client-Id header")
    return x_client_id


def require_owner(x_client_id: Optional[str]) -> str:
    if not x_client_id:
        raise HTTPException(status_code=400, detail="Missing X-Client-Id header")
    return x_client_id


# ---------------------------------------------------------------------------
# Content routes
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Chess Learning API", "status": "ok"}


@api_router.get("/openings")
async def list_openings(
    side: Optional[str] = None,
    difficulty: Optional[str] = None,
):
    q = {}
    if side:
        q["side"] = side
    if difficulty:
        q["difficulty"] = difficulty
    docs = await db.openings.find(q, {"_id": 0}).to_list(500)
    return docs


@api_router.get("/openings/{opening_id}")
async def get_opening(opening_id: str):
    doc = await db.openings.find_one({"id": opening_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Opening not found")
    return doc


@api_router.get("/lessons")
async def list_lessons(
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
):
    q = {}
    if difficulty:
        q["difficulty"] = difficulty
    if category:
        q["category"] = category
    docs = await db.lessons.find(q, {"_id": 0}).to_list(500)
    return docs


@api_router.get("/lessons/{lesson_id}")
async def get_lesson(lesson_id: str):
    doc = await db.lessons.find_one({"id": lesson_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return doc


@api_router.get("/tactics")
async def list_tactics(
    theme: Optional[str] = None,
    difficulty: Optional[str] = None,
):
    q = {}
    if theme:
        q["theme"] = theme
    if difficulty:
        q["difficulty"] = difficulty
    docs = await db.tactics.find(q, {"_id": 0}).to_list(500)
    return docs


@api_router.get("/tactics/{tactic_id}")
async def get_tactic(tactic_id: str):
    doc = await db.tactics.find_one({"id": tactic_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Tactic not found")
    return doc


@api_router.get("/puzzles/daily")
async def daily_puzzle():
    tactics = await db.tactics.find({}, {"_id": 0}).to_list(500)
    if not tactics:
        raise HTTPException(status_code=404, detail="No tactics available")
    tactics.sort(key=lambda t: t["id"])
    today = date.today()
    idx = today.toordinal() % len(tactics)
    puzzle = tactics[idx]
    return {"date": today.isoformat(), "puzzle": puzzle}


@api_router.get("/search")
async def search(q: str = Query(default=""), filter: Optional[str] = None):
    ql = q.strip().lower()
    results = []

    openings = await db.openings.find({}, {"_id": 0}).to_list(500)
    lessons = await db.lessons.find({}, {"_id": 0}).to_list(500)
    tactics = await db.tactics.find({}, {"_id": 0}).to_list(500)

    def match(text: str) -> bool:
        return ql in (text or "").lower() if ql else True

    if filter in (None, "all", "openings"):
        for o in openings:
            if match(o["name"]) or match(o["description"]) or match(o["difficulty"]):
                results.append({"type": "opening", "id": o["id"], "title": o["name"],
                                "subtitle": f"{o['side'].title()} • {o['difficulty']}",
                                "difficulty": o["difficulty"]})
    if filter in (None, "all", "lessons", "endgames", "checkmates", "strategy"):
        for l in lessons:
            cat = l["category"].lower()
            if filter == "endgames" and cat != "endgame":
                continue
            if filter == "checkmates" and cat != "checkmate":
                continue
            if filter == "strategy" and cat != "strategy":
                continue
            if match(l["title"]) or match(l["description"]) or match(l["category"]):
                results.append({"type": "lesson", "id": l["id"], "title": l["title"],
                                "subtitle": f"{l['category']} • {l['difficulty']}",
                                "difficulty": l["difficulty"]})
    if filter in (None, "all", "tactics"):
        for t in tactics:
            if match(t["theme"]) or match(t["explanation"]) or match(t["difficulty"]):
                results.append({"type": "tactic", "id": t["id"], "title": t["theme"],
                                "subtitle": f"Tactic • {t['difficulty']}",
                                "difficulty": t["difficulty"]})

    # difficulty-only filters
    if filter in ("beginner", "intermediate", "advanced"):
        results = [r for r in results if r["difficulty"].lower() == filter]

    return {"query": q, "count": len(results), "results": results}


@api_router.get("/meta")
async def meta():
    return {
        "levels": CONTENT["levels"],
        "achievements": ACHIEVEMENTS,
        "categories": ["Basics", "Opening", "Strategy", "Tactics", "Checkmate", "Endgame"],
        "difficulties": ["Beginner", "Intermediate", "Advanced"],
        "themes": [t["theme"] for t in CONTENT["tactics"]],
    }


# ---------------------------------------------------------------------------
# Auth routes (email/password JWT + Emergent Google OAuth) -> unified user
# ---------------------------------------------------------------------------
@api_router.post("/auth/register")
async def auth_register(body: RegisterBody):
    email = body.email.lower().strip()
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    user = {
        "user_id": user_id,
        "email": email,
        "name": body.name or email.split("@")[0],
        "picture": None,
        "password_hash": hash_password(body.password),
        "auth_provider": "email",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(dict(user))
    await merge_anon_into_user(body.client_id, user_id)
    token = create_jwt(user_id)
    return {"token": token, "user": public_user(user)}


@api_router.post("/auth/login")
async def auth_login(body: LoginBody):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user or not user.get("password_hash") or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await merge_anon_into_user(body.client_id, user["user_id"])
    token = create_jwt(user["user_id"])
    return {"token": token, "user": public_user(user)}


@api_router.post("/auth/session")
async def auth_session(body: SessionBody, response: Response):
    """Exchange an Emergent OAuth session_id for a user + session_token (Google login)."""
    try:
        async with httpx.AsyncClient(timeout=15) as http:
            r = await http.get(EMERGENT_SESSION_URL, headers={"X-Session-ID": body.session_id})
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Auth provider unreachable: {e}")
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    data = r.json()
    email = (data.get("email") or "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="No email returned from provider")

    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "name": data.get("name") or email.split("@")[0],
            "picture": data.get("picture"),
            "auth_provider": "google",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(dict(user))
    else:
        # keep google profile fresh
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"name": data.get("name") or user.get("name"), "picture": data.get("picture") or user.get("picture")}},
        )

    session_token = data.get("session_token") or f"st_{uuid.uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)
    await db.user_sessions.update_one(
        {"session_token": session_token},
        {"$set": {"user_id": user["user_id"], "session_token": session_token,
                   "expires_at": expires_at.isoformat(), "created_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    await merge_anon_into_user(body.client_id, user["user_id"])

    response.set_cookie(
        key="session_token", value=session_token, httponly=True, secure=True,
        samesite="none", path="/", max_age=SESSION_TTL_DAYS * 24 * 3600,
    )
    return {"token": session_token, "user": public_user(user)}


@api_router.get("/auth/me")
async def auth_me(request: Request):
    user = await resolve_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return public_user(user)


@api_router.post("/auth/logout")
async def auth_logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if not token:
        auth = request.headers.get("Authorization") or ""
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/", samesite="none", secure=True)
    return {"ok": True}


# ---------------------------------------------------------------------------
# Progress routes (owner = authenticated user_id, else anonymous X-Client-Id)
# ---------------------------------------------------------------------------
@api_router.get("/progress")
async def get_progress(request: Request, x_client_id: Optional[str] = Header(default=None)):
    owner = await resolve_owner(request, x_client_id)
    p = await get_or_create_progress(owner)
    return enrich_progress(p)


@api_router.post("/progress/lesson")
async def complete_lesson(body: CompleteItem, request: Request, x_client_id: Optional[str] = Header(default=None)):
    owner = await resolve_owner(request, x_client_id)
    lesson = await db.lessons.find_one({"id": body.item_id}, {"_id": 0})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    p = await get_or_create_progress(owner)
    gained = 0
    leveled_from = compute_level(p["xp"])["level"]
    if body.item_id not in p["completed_lessons"]:
        p["completed_lessons"].append(body.item_id)
        gained = lesson.get("xp_reward", 50)
        p["xp"] += gained
    apply_streak(p)
    await save_progress(p)
    enriched = enrich_progress(p)
    enriched["xp_gained"] = gained
    enriched["leveled_up"] = compute_level(p["xp"])["level"] > leveled_from
    return enriched


@api_router.post("/progress/opening")
async def complete_opening(body: CompleteItem, request: Request, x_client_id: Optional[str] = Header(default=None)):
    owner = await resolve_owner(request, x_client_id)
    opening = await db.openings.find_one({"id": body.item_id}, {"_id": 0})
    if not opening:
        raise HTTPException(status_code=404, detail="Opening not found")
    p = await get_or_create_progress(owner)
    gained = 0
    leveled_from = compute_level(p["xp"])["level"]
    if body.item_id not in p["completed_openings"]:
        p["completed_openings"].append(body.item_id)
        gained = opening.get("xp_reward", 100)
        p["xp"] += gained
    apply_streak(p)
    await save_progress(p)
    enriched = enrich_progress(p)
    enriched["xp_gained"] = gained
    enriched["leveled_up"] = compute_level(p["xp"])["level"] > leveled_from
    return enriched


@api_router.post("/progress/tactic")
async def solve_tactic(body: TacticAttempt, request: Request, x_client_id: Optional[str] = Header(default=None)):
    owner = await resolve_owner(request, x_client_id)
    tactic = await db.tactics.find_one({"id": body.tactic_id}, {"_id": 0})
    if not tactic:
        raise HTTPException(status_code=404, detail="Tactic not found")
    p = await get_or_create_progress(owner)
    gained = 0
    leveled_from = compute_level(p["xp"])["level"]
    p["tactics_attempts"] = p.get("tactics_attempts", 0) + 1
    if body.correct:
        p["tactics_correct"] = p.get("tactics_correct", 0) + 1
        if body.tactic_id not in p["solved_tactics"]:
            p["solved_tactics"].append(body.tactic_id)
            gained = 40
            p["xp"] += gained
    apply_streak(p)
    await save_progress(p)
    enriched = enrich_progress(p)
    enriched["xp_gained"] = gained
    enriched["leveled_up"] = compute_level(p["xp"])["level"] > leveled_from
    return enriched


@api_router.post("/progress/reset")
async def reset_progress(request: Request, x_client_id: Optional[str] = Header(default=None)):
    owner = await resolve_owner(request, x_client_id)
    p = default_progress(owner)
    await save_progress(p)
    return enrich_progress(p)


# ---------------------------------------------------------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
