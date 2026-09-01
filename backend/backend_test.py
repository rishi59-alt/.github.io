#!/usr/bin/env python3
"""
Comprehensive backend API test for CHESS learning platform.
Tests all endpoints: content, search, progress, gamification.
"""
import requests
import sys
from datetime import datetime

BASE_URL = "https://openings-hub-6.preview.emergentagent.com/api"
CLIENT_ID = f"test_client_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

class ChessAPITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.tests_failed = 0
        self.failures = []

    def test(self, name, method, endpoint, expected_status=200, data=None, headers=None, validate=None):
        """Run a single API test with optional validation"""
        url = f"{BASE_URL}{endpoint}"
        h = headers or {}
        
        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=h, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=h, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            # Check status code
            if response.status_code != expected_status:
                self.tests_failed += 1
                msg = f"❌ FAILED - Expected {expected_status}, got {response.status_code}"
                print(msg)
                self.failures.append(f"{name}: {msg}")
                try:
                    print(f"   Response: {response.text[:200]}")
                except:
                    pass
                return False, None

            # Parse JSON
            try:
                json_data = response.json()
            except:
                if expected_status == 200:
                    self.tests_failed += 1
                    msg = "❌ FAILED - Invalid JSON response"
                    print(msg)
                    self.failures.append(f"{name}: {msg}")
                    return False, None
                json_data = None

            # Custom validation
            if validate:
                try:
                    validate(json_data)
                except AssertionError as e:
                    self.tests_failed += 1
                    msg = f"❌ FAILED - Validation error: {str(e)}"
                    print(msg)
                    self.failures.append(f"{name}: {msg}")
                    return False, json_data

            self.tests_passed += 1
            print(f"✅ PASSED - Status: {response.status_code}")
            return True, json_data

        except requests.exceptions.Timeout:
            self.tests_failed += 1
            msg = "❌ FAILED - Request timeout"
            print(msg)
            self.failures.append(f"{name}: {msg}")
            return False, None
        except Exception as e:
            self.tests_failed += 1
            msg = f"❌ FAILED - Error: {str(e)}"
            print(msg)
            self.failures.append(f"{name}: {msg}")
            return False, None

    def run_all_tests(self):
        """Execute all backend API tests"""
        print("=" * 70)
        print("CHESS LEARNING PLATFORM - BACKEND API TEST SUITE")
        print("=" * 70)

        # ===== HEALTH CHECK =====
        print("\n" + "=" * 70)
        print("HEALTH CHECK")
        print("=" * 70)
        
        self.test(
            "GET /api/ returns ok",
            "GET", "/",
            validate=lambda d: (
                assert_field(d, "status", "ok"),
                assert_field(d, "message")
            )
        )

        # ===== OPENINGS =====
        print("\n" + "=" * 70)
        print("OPENINGS ENDPOINTS")
        print("=" * 70)
        
        success, openings = self.test(
            "GET /api/openings returns 14 openings",
            "GET", "/openings",
            validate=lambda d: assert_length(d, 14, "openings")
        )
        
        if success and openings:
            # Validate opening structure
            self.test(
                "Opening has required fields",
                "GET", "/openings",
                validate=lambda d: (
                    assert_field(d[0], "id"),
                    assert_field(d[0], "name"),
                    assert_field(d[0], "side"),
                    assert_field(d[0], "difficulty"),
                    assert_field(d[0], "moves"),
                    assert_field(d[0], "xp_reward")
                )
            )
            
            # Test specific opening
            self.test(
                "GET /api/openings/italian-game returns opening with moves",
                "GET", "/openings/italian-game",
                validate=lambda d: (
                    assert_field(d, "id", "italian-game"),
                    assert_field(d, "moves"),
                    assert_true(isinstance(d["moves"], list) and len(d["moves"]) > 0, "moves is non-empty array")
                )
            )
            
            # Test filters
            self.test(
                "GET /api/openings?side=white filters correctly",
                "GET", "/openings?side=white",
                validate=lambda d: assert_all_match(d, "side", "white")
            )
            
            self.test(
                "GET /api/openings?difficulty=Beginner filters correctly",
                "GET", "/openings?difficulty=Beginner",
                validate=lambda d: assert_all_match(d, "difficulty", "Beginner")
            )

        # Test 404
        self.test(
            "GET /api/openings/nonexistent returns 404",
            "GET", "/openings/nonexistent",
            expected_status=404
        )

        # ===== LESSONS =====
        print("\n" + "=" * 70)
        print("LESSONS ENDPOINTS")
        print("=" * 70)
        
        success, lessons = self.test(
            "GET /api/lessons returns 16 lessons",
            "GET", "/lessons",
            validate=lambda d: assert_length(d, 16, "lessons")
        )
        
        if success and lessons:
            # Validate lesson structure
            self.test(
                "Lesson has required fields",
                "GET", "/lessons",
                validate=lambda d: (
                    assert_field(d[0], "id"),
                    assert_field(d[0], "title"),
                    assert_field(d[0], "difficulty"),
                    assert_field(d[0], "category"),
                    assert_field(d[0], "steps"),
                    assert_field(d[0], "xp_reward")
                )
            )
            
            # Test specific lesson
            self.test(
                "GET /api/lessons/control-the-center returns steps",
                "GET", "/lessons/control-the-center",
                validate=lambda d: (
                    assert_field(d, "id", "control-the-center"),
                    assert_field(d, "steps"),
                    assert_true(isinstance(d["steps"], list) and len(d["steps"]) > 0, "steps is non-empty array")
                )
            )
            
            # Test filters
            self.test(
                "GET /api/lessons?category=Strategy filters correctly",
                "GET", "/lessons?category=Strategy",
                validate=lambda d: assert_all_match(d, "category", "Strategy")
            )

        # Test 404
        self.test(
            "GET /api/lessons/nonexistent returns 404",
            "GET", "/lessons/nonexistent",
            expected_status=404
        )

        # ===== TACTICS =====
        print("\n" + "=" * 70)
        print("TACTICS ENDPOINTS")
        print("=" * 70)
        
        success, tactics = self.test(
            "GET /api/tactics returns 12 tactics",
            "GET", "/tactics",
            validate=lambda d: assert_length(d, 12, "tactics")
        )
        
        if success and tactics:
            # Validate tactic structure
            self.test(
                "Tactic has required fields",
                "GET", "/tactics",
                validate=lambda d: (
                    assert_field(d[0], "id"),
                    assert_field(d[0], "theme"),
                    assert_field(d[0], "difficulty"),
                    assert_field(d[0], "fen"),
                    assert_field(d[0], "solution"),
                    assert_field(d[0], "explanation")
                )
            )
            
            # Test specific tactic
            self.test(
                "GET /api/tactics/t-fork returns fen+solution",
                "GET", "/tactics/t-fork",
                validate=lambda d: (
                    assert_field(d, "id", "t-fork"),
                    assert_field(d, "fen"),
                    assert_field(d, "solution"),
                    assert_true(isinstance(d["solution"], list), "solution is array")
                )
            )

        # Test 404
        self.test(
            "GET /api/tactics/nonexistent returns 404",
            "GET", "/tactics/nonexistent",
            expected_status=404
        )

        # ===== DAILY PUZZLE =====
        print("\n" + "=" * 70)
        print("DAILY PUZZLE ENDPOINT")
        print("=" * 70)
        
        self.test(
            "GET /api/puzzles/daily returns puzzle with date",
            "GET", "/puzzles/daily",
            validate=lambda d: (
                assert_field(d, "date"),
                assert_field(d, "puzzle"),
                assert_field(d["puzzle"], "id"),
                assert_field(d["puzzle"], "fen"),
                assert_field(d["puzzle"], "solution")
            )
        )

        # ===== SEARCH =====
        print("\n" + "=" * 70)
        print("SEARCH ENDPOINT")
        print("=" * 70)
        
        self.test(
            "GET /api/search?q=sicilian returns results",
            "GET", "/search?q=sicilian",
            validate=lambda d: (
                assert_field(d, "query", "sicilian"),
                assert_field(d, "count"),
                assert_field(d, "results"),
                assert_true(d["count"] > 0, "found results for 'sicilian'")
            )
        )
        
        self.test(
            "GET /api/search?q=&filter=lessons returns lessons",
            "GET", "/search?q=&filter=lessons",
            validate=lambda d: (
                assert_field(d, "results"),
                assert_true(all(r["type"] == "lesson" for r in d["results"]), "all results are lessons")
            )
        )
        
        self.test(
            "GET /api/search?filter=openings returns only openings",
            "GET", "/search?filter=openings",
            validate=lambda d: assert_true(all(r["type"] == "opening" for r in d["results"]), "all results are openings")
        )

        # ===== META =====
        print("\n" + "=" * 70)
        print("META ENDPOINT")
        print("=" * 70)
        
        self.test(
            "GET /api/meta returns levels/achievements/categories",
            "GET", "/meta",
            validate=lambda d: (
                assert_field(d, "levels"),
                assert_field(d, "achievements"),
                assert_field(d, "categories"),
                assert_field(d, "difficulties"),
                assert_true(isinstance(d["achievements"], list), "achievements is array")
            )
        )

        # ===== PROGRESS (requires X-Client-Id) =====
        print("\n" + "=" * 70)
        print("PROGRESS ENDPOINTS (Anonymous per-device)")
        print("=" * 70)
        
        # Test without header
        self.test(
            "GET /api/progress without X-Client-Id returns 400",
            "GET", "/progress",
            expected_status=400
        )
        
        # Test with header
        headers = {"X-Client-Id": CLIENT_ID}
        
        success, progress = self.test(
            "GET /api/progress with X-Client-Id returns progress",
            "GET", "/progress",
            headers=headers,
            validate=lambda d: (
                assert_field(d, "owner_id", CLIENT_ID),
                assert_field(d, "xp"),
                assert_field(d, "level"),
                assert_field(d, "title"),
                assert_field(d, "streak"),
                assert_field(d, "accuracy"),
                assert_field(d, "stats"),
                assert_field(d, "achievements"),
                assert_true(d["xp"] == 0, "initial xp is 0"),
                assert_true(d["level"] == 1, "initial level is 1")
            )
        )

        # ===== PROGRESS UPDATES =====
        print("\n" + "=" * 70)
        print("PROGRESS UPDATE ENDPOINTS")
        print("=" * 70)
        
        # Complete a lesson
        success, result = self.test(
            "POST /api/progress/lesson awards xp (60) and marks complete",
            "POST", "/progress/lesson",
            headers=headers,
            data={"item_id": "chess-basics"},
            validate=lambda d: (
                assert_field(d, "xp_gained"),
                assert_field(d, "leveled_up"),
                assert_true(d["xp_gained"] == 60, "chess-basics awards 60 xp"),
                assert_true("chess-basics" in d["completed_lessons"], "lesson marked complete")
            )
        )
        
        # Complete an opening
        success, result = self.test(
            "POST /api/progress/opening awards xp (120)",
            "POST", "/progress/opening",
            headers=headers,
            data={"item_id": "italian-game"},
            validate=lambda d: (
                assert_field(d, "xp_gained"),
                assert_true(d["xp_gained"] == 120, "italian-game awards 120 xp"),
                assert_true("italian-game" in d["completed_openings"], "opening marked complete")
            )
        )
        
        # Solve a tactic (correct)
        success, result = self.test(
            "POST /api/progress/tactic (correct) awards 40 xp",
            "POST", "/progress/tactic",
            headers=headers,
            data={"tactic_id": "t-fork", "correct": True},
            validate=lambda d: (
                assert_field(d, "xp_gained"),
                assert_true(d["xp_gained"] == 40, "correct tactic awards 40 xp"),
                assert_true("t-fork" in d["solved_tactics"], "tactic marked solved"),
                assert_true(d["tactics_correct"] >= 1, "tactics_correct incremented")
            )
        )
        
        # Solve a tactic (wrong)
        success, result = self.test(
            "POST /api/progress/tactic (wrong) increments attempts only",
            "POST", "/progress/tactic",
            headers=headers,
            data={"tactic_id": "t-pin", "correct": False},
            validate=lambda d: (
                assert_field(d, "xp_gained"),
                assert_true(d["xp_gained"] == 0, "wrong tactic awards 0 xp"),
                assert_true("t-pin" not in d["solved_tactics"], "tactic not marked solved"),
                assert_true(d["tactics_attempts"] >= 2, "tactics_attempts incremented")
            )
        )
        
        # Check streak
        success, progress_after = self.test(
            "Streak becomes 1 on first activity",
            "GET", "/progress",
            headers=headers,
            validate=lambda d: assert_true(d["streak"] >= 1, "streak is at least 1 after activity")
        )
        
        # Check achievements
        if success and progress_after:
            self.test(
                "Achievements 'earned' flags computed from stats",
                "GET", "/progress",
                headers=headers,
                validate=lambda d: (
                    assert_true(isinstance(d["achievements"], list), "achievements is array"),
                    assert_true(len(d["achievements"]) > 0, "achievements present"),
                    assert_true(all("earned" in a for a in d["achievements"]), "all achievements have 'earned' flag")
                )
            )
        
        # Reset progress
        success, reset = self.test(
            "POST /api/progress/reset clears progress",
            "POST", "/progress/reset",
            headers=headers,
            validate=lambda d: (
                assert_true(d["xp"] == 0, "xp reset to 0"),
                assert_true(d["level"] == 1, "level reset to 1"),
                assert_true(len(d["completed_lessons"]) == 0, "completed_lessons cleared"),
                assert_true(len(d["completed_openings"]) == 0, "completed_openings cleared"),
                assert_true(len(d["solved_tactics"]) == 0, "solved_tactics cleared")
            )
        )

        # ===== AUTH ENDPOINTS =====
        print("\n" + "=" * 70)
        print("AUTH ENDPOINTS (Email/Password)")
        print("=" * 70)
        
        # Generate unique test email
        test_email = f"tester+{datetime.now().strftime('%Y%m%d%H%M%S')}@chess.dev"
        test_password = "secret123"
        test_name = "Test Player"
        
        # Test register with short password (should fail)
        self.test(
            "POST /api/auth/register with short password (<6) returns 422",
            "POST", "/auth/register",
            expected_status=422,
            data={"email": test_email, "password": "abc", "name": test_name}
        )
        
        # Test register with valid data
        success, register_result = self.test(
            "POST /api/auth/register creates account and returns token+user",
            "POST", "/auth/register",
            data={"email": test_email, "password": test_password, "name": test_name},
            validate=lambda d: (
                assert_field(d, "token"),
                assert_field(d, "user"),
                assert_field(d["user"], "user_id"),
                assert_field(d["user"], "email", test_email),
                assert_field(d["user"], "name", test_name),
                assert_field(d["user"], "auth_provider", "email")
            )
        )
        
        auth_token = None
        user_id = None
        if success and register_result:
            auth_token = register_result["token"]
            user_id = register_result["user"]["user_id"]
        
        # Test duplicate email (should fail)
        self.test(
            "POST /api/auth/register with duplicate email returns 409",
            "POST", "/auth/register",
            expected_status=409,
            data={"email": test_email, "password": test_password, "name": "Another Name"}
        )
        
        # Test login with wrong password
        self.test(
            "POST /api/auth/login with wrong password returns 401",
            "POST", "/auth/login",
            expected_status=401,
            data={"email": test_email, "password": "wrongpassword"}
        )
        
        # Test login with unknown email
        self.test(
            "POST /api/auth/login with unknown email returns 401",
            "POST", "/auth/login",
            expected_status=401,
            data={"email": "nonexistent@example.com", "password": test_password}
        )
        
        # Test login with correct credentials
        success, login_result = self.test(
            "POST /api/auth/login with correct credentials returns token+user",
            "POST", "/auth/login",
            data={"email": test_email, "password": test_password},
            validate=lambda d: (
                assert_field(d, "token"),
                assert_field(d, "user"),
                assert_field(d["user"], "email", test_email)
            )
        )
        
        # Test /auth/me without token
        self.test(
            "GET /api/auth/me without Authorization returns 401",
            "GET", "/auth/me",
            expected_status=401
        )
        
        # Test /auth/me with Bearer token
        if auth_token:
            self.test(
                "GET /api/auth/me with Bearer token returns user",
                "GET", "/auth/me",
                headers={"Authorization": f"Bearer {auth_token}"},
                validate=lambda d: (
                    assert_field(d, "user_id", user_id),
                    assert_field(d, "email", test_email),
                    assert_field(d, "name", test_name)
                )
            )
        
        # Test logout
        if auth_token:
            self.test(
                "POST /api/auth/logout with Bearer token succeeds",
                "POST", "/auth/logout",
                headers={"Authorization": f"Bearer {auth_token}"},
                validate=lambda d: assert_field(d, "ok", True)
            )

        # ===== ANONYMOUS-TO-AUTHENTICATED MERGE =====
        print("\n" + "=" * 70)
        print("ANONYMOUS-TO-AUTHENTICATED MERGE")
        print("=" * 70)
        
        # Create a new anonymous client
        merge_client_id = f"mergecid_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        merge_headers = {"X-Client-Id": merge_client_id}
        
        # Complete items as anonymous
        self.test(
            "Anonymous: Complete lesson chess-basics (60 xp)",
            "POST", "/progress/lesson",
            headers=merge_headers,
            data={"item_id": "chess-basics"},
            validate=lambda d: assert_true(d["xp_gained"] == 60, "lesson awards 60 xp")
        )
        
        self.test(
            "Anonymous: Solve tactic t-fork (40 xp)",
            "POST", "/progress/tactic",
            headers=merge_headers,
            data={"tactic_id": "t-fork", "correct": True},
            validate=lambda d: assert_true(d["xp_gained"] == 40, "tactic awards 40 xp")
        )
        
        # Check anonymous progress (should have 100 xp)
        success, anon_progress = self.test(
            "Anonymous progress shows 100 xp, 1 lesson, 1 tactic",
            "GET", "/progress",
            headers=merge_headers,
            validate=lambda d: (
                assert_true(d["xp"] == 100, "xp is 100"),
                assert_true(len(d["completed_lessons"]) >= 1, "has completed lessons"),
                assert_true(len(d["solved_tactics"]) >= 1, "has solved tactics")
            )
        )
        
        # Register with client_id (should merge)
        merge_email = f"merge+{datetime.now().strftime('%Y%m%d%H%M%S')}@chess.dev"
        success, merge_register = self.test(
            "POST /api/auth/register with client_id merges anonymous progress",
            "POST", "/auth/register",
            data={"email": merge_email, "password": test_password, "name": "Merge Test", "client_id": merge_client_id},
            validate=lambda d: (
                assert_field(d, "token"),
                assert_field(d, "user")
            )
        )
        
        merge_token = None
        if success and merge_register:
            merge_token = merge_register["token"]
        
        # Check merged progress (should have 100 xp)
        if merge_token:
            self.test(
                "Merged progress shows 100 xp, 1 lesson, 1 tactic",
                "GET", "/progress",
                headers={"Authorization": f"Bearer {merge_token}"},
                validate=lambda d: (
                    assert_true(d["xp"] >= 100, f"xp is at least 100 (got {d.get('xp')})"),
                    assert_true(len(d["completed_lessons"]) >= 1, "has completed lessons"),
                    assert_true(len(d["solved_tactics"]) >= 1, "has solved tactics")
                )
            )
        
        # Check anonymous progress is cleared
        success, cleared_anon = self.test(
            "Anonymous progress after merge is reset/empty",
            "GET", "/progress",
            headers=merge_headers,
            validate=lambda d: (
                assert_true(d["xp"] == 0, "anonymous xp is 0 after merge"),
                assert_true(len(d["completed_lessons"]) == 0, "anonymous lessons cleared"),
                assert_true(len(d["solved_tactics"]) == 0, "anonymous tactics cleared")
            )
        )

        # ===== OWNER RESOLUTION =====
        print("\n" + "=" * 70)
        print("OWNER RESOLUTION (Authenticated takes precedence)")
        print("=" * 70)
        
        if merge_token:
            # Complete an item with both Bearer token AND X-Client-Id
            # Should use authenticated user, not client_id
            another_client_id = f"othercid_{datetime.now().strftime('%Y%m%d%H%M%S')}"
            self.test(
                "POST /api/progress/opening with Bearer + X-Client-Id uses authenticated user",
                "POST", "/progress/opening",
                headers={"Authorization": f"Bearer {merge_token}", "X-Client-Id": another_client_id},
                data={"item_id": "italian-game"},
                validate=lambda d: (
                    assert_field(d, "xp_gained"),
                    assert_true(d["xp"] >= 220, "xp increased from merged progress (100 + 120)")
                )
            )
            
            # Verify progress is on the authenticated user, not the other client_id
            self.test(
                "GET /api/progress with Bearer shows updated progress",
                "GET", "/progress",
                headers={"Authorization": f"Bearer {merge_token}"},
                validate=lambda d: (
                    assert_true("italian-game" in d["completed_openings"], "opening completed on user account"),
                    assert_true(d["xp"] >= 220, "xp is at least 220")
                )
            )
            
            # Verify the other client_id has no progress
            self.test(
                "GET /api/progress with other X-Client-Id has no progress",
                "GET", "/progress",
                headers={"X-Client-Id": another_client_id},
                validate=lambda d: assert_true(d["xp"] == 0, "other client_id has 0 xp")
            )

        # ===== SUMMARY =====
        print("\n" + "=" * 70)
        print("TEST SUMMARY")
        print("=" * 70)
        print(f"Total tests: {self.tests_run}")
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {self.tests_failed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failures:
            print("\n" + "=" * 70)
            print("FAILED TESTS:")
            print("=" * 70)
            for failure in self.failures:
                print(f"  • {failure}")
        
        return 0 if self.tests_failed == 0 else 1


# ===== VALIDATION HELPERS =====
def assert_field(obj, field, expected_value=None):
    """Assert field exists and optionally matches expected value"""
    if field not in obj:
        raise AssertionError(f"Missing field: {field}")
    if expected_value is not None and obj[field] != expected_value:
        raise AssertionError(f"Field {field}: expected {expected_value}, got {obj[field]}")
    return True

def assert_length(arr, expected, name="array"):
    """Assert array has expected length"""
    if not isinstance(arr, list):
        raise AssertionError(f"{name} is not an array")
    if len(arr) != expected:
        raise AssertionError(f"{name}: expected {expected} items, got {len(arr)}")
    return True

def assert_true(condition, message):
    """Assert condition is true"""
    if not condition:
        raise AssertionError(message)
    return True

def assert_all_match(arr, field, value):
    """Assert all items in array have field matching value"""
    if not all(item.get(field) == value for item in arr):
        raise AssertionError(f"Not all items have {field}={value}")
    return True


if __name__ == "__main__":
    tester = ChessAPITester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)
