#!/usr/bin/env python3
"""
Test Google OAuth simulation (create user + session directly in DB)
"""
import os
import sys
import requests
from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
BASE_URL = "https://openings-hub-6.preview.emergentagent.com/api"

async def test_google_oauth_simulation():
    """Test Google OAuth by creating user + session directly in MongoDB"""
    print("=" * 70)
    print("GOOGLE OAUTH SIMULATION TEST")
    print("=" * 70)
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Generate unique user
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    user_id = f"user_google_{timestamp}"
    session_token = f"test_session_{timestamp}"
    email = f"google.{timestamp}@example.com"
    
    print(f"\n1. Creating Google user in DB...")
    print(f"   user_id: {user_id}")
    print(f"   email: {email}")
    
    # Create user
    user_doc = {
        "user_id": user_id,
        "email": email,
        "name": "Google Test User",
        "picture": "https://example.com/avatar.jpg",
        "auth_provider": "google",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    print("   ✅ User created")
    
    # Create session
    print(f"\n2. Creating session in DB...")
    print(f"   session_token: {session_token}")
    
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    print("   ✅ Session created")
    
    # Test /auth/me with session_token as Bearer
    print(f"\n3. Testing GET /api/auth/me with Bearer {session_token[:20]}...")
    response = requests.get(
        f"{BASE_URL}/auth/me",
        headers={"Authorization": f"Bearer {session_token}"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Status: 200")
        print(f"   User: {data.get('name')} ({data.get('email')})")
        print(f"   Auth provider: {data.get('auth_provider')}")
        
        if data.get("user_id") != user_id:
            print(f"   ❌ FAILED: user_id mismatch (expected {user_id}, got {data.get('user_id')})")
            return False
        if data.get("email") != email:
            print(f"   ❌ FAILED: email mismatch")
            return False
        if data.get("auth_provider") != "google":
            print(f"   ❌ FAILED: auth_provider should be 'google'")
            return False
    else:
        print(f"   ❌ FAILED: Status {response.status_code}")
        print(f"   Response: {response.text}")
        return False
    
    # Test logout
    print(f"\n4. Testing POST /api/auth/logout with Bearer token...")
    response = requests.post(
        f"{BASE_URL}/auth/logout",
        headers={"Authorization": f"Bearer {session_token}"}
    )
    
    if response.status_code == 200:
        print(f"   ✅ Status: 200")
    else:
        print(f"   ❌ FAILED: Status {response.status_code}")
        return False
    
    # Verify session is deleted
    print(f"\n5. Verifying session is deleted from DB...")
    session_check = await db.user_sessions.find_one({"session_token": session_token})
    if session_check:
        print(f"   ❌ FAILED: Session still exists in DB")
        return False
    else:
        print(f"   ✅ Session deleted from DB")
    
    # Test /auth/me again (should return 401)
    print(f"\n6. Testing GET /api/auth/me after logout (should return 401)...")
    response = requests.get(
        f"{BASE_URL}/auth/me",
        headers={"Authorization": f"Bearer {session_token}"}
    )
    
    if response.status_code == 401:
        print(f"   ✅ Status: 401 (correctly unauthenticated)")
    else:
        print(f"   ❌ FAILED: Status {response.status_code} (expected 401)")
        return False
    
    # Cleanup
    await db.users.delete_one({"user_id": user_id})
    
    print("\n" + "=" * 70)
    print("✅ ALL GOOGLE OAUTH SIMULATION TESTS PASSED")
    print("=" * 70)
    
    client.close()
    return True

if __name__ == "__main__":
    result = asyncio.run(test_google_oauth_simulation())
    sys.exit(0 if result else 1)
