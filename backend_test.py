import requests
import sys
import json
import time
from datetime import datetime

class OFFAPITester:
    def __init__(self, base_url="https://real-life-on.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_child_id = None
        self.created_family_id = None
        self.created_challenge_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_create_child(self):
        """Test creating a child"""
        child_data = {
            "name": "Emma Test",
            "age": 8,
            "interests": ["lecture", "sport", "nature"],
            "screen_time_goal": 60
        }
        
        success, response = self.run_test(
            "Create Child",
            "POST", 
            "children",
            200,  # Changed from 201 to 200 based on FastAPI default
            data=child_data
        )
        
        if success and 'id' in response:
            self.created_child_id = response['id']
            print(f"   Created child ID: {self.created_child_id}")
            return True
        return False

    def test_get_children(self):
        """Test getting all children"""
        return self.run_test("Get All Children", "GET", "children", 200)

    def test_get_child_by_id(self):
        """Test getting a specific child"""
        if not self.created_child_id:
            print("❌ Skipped - No child ID available")
            return False
            
        return self.run_test(
            "Get Child by ID",
            "GET",
            f"children/{self.created_child_id}",
            200
        )

    def test_get_challenges(self):
        """Test getting all challenges"""
        return self.run_test("Get All Challenges", "GET", "challenges", 200)

    def test_create_challenge(self):
        """Test creating a manual challenge"""
        challenge_data = {
            "title": "Test Challenge",
            "description": "A test challenge for validation",
            "category": "creative",
            "age_range": [6, 12],
            "duration_minutes": 30,
            "fun_credits": 25,
            "difficulty": "easy"
        }
        
        success, response = self.run_test(
            "Create Challenge",
            "POST",
            "challenges", 
            200,
            data=challenge_data
        )
        
        if success and 'id' in response:
            self.created_challenge_id = response['id']
            print(f"   Created challenge ID: {self.created_challenge_id}")
            return True
        return False

    def test_ai_challenge_generation(self):
        """Test AI challenge generation with GPT-5"""
        if not self.created_child_id:
            print("❌ Skipped - No child ID available")
            return False
            
        ai_request = {
            "child_id": self.created_child_id,
            "category": "outdoor"
        }
        
        print("   ⚠️  This test may take 10-30 seconds due to AI processing...")
        success, response = self.run_test(
            "AI Challenge Generation (GPT-5)",
            "POST",
            "challenges/generate",
            200,
            data=ai_request,
            timeout=60  # Longer timeout for AI
        )
        
        if success and 'title' in response:
            print(f"   Generated challenge: {response.get('title', 'N/A')}")
            print(f"   Category: {response.get('category', 'N/A')}")
            print(f"   Fun credits: {response.get('fun_credits', 'N/A')}")
            return True
        return False

    def test_complete_challenge(self):
        """Test completing a challenge"""
        if not self.created_child_id or not self.created_challenge_id:
            print("❌ Skipped - Missing child or challenge ID")
            return False
            
        completion_data = {
            "child_id": self.created_child_id,
            "challenge_id": self.created_challenge_id,
            "validation_method": "parent"
        }
        
        return self.run_test(
            "Complete Challenge",
            "POST",
            "challenges/complete",
            200,
            data=completion_data
        )

    def test_create_family(self):
        """Test creating a family"""
        family_data = {
            "name": "Famille Test"
        }
        
        success, response = self.run_test(
            "Create Family",
            "POST",
            "families",
            200,
            data=family_data
        )
        
        if success and 'id' in response:
            self.created_family_id = response['id']
            print(f"   Created family ID: {self.created_family_id}")
            return True
        return False

    def test_get_families(self):
        """Test getting all families"""
        return self.run_test("Get All Families", "GET", "families", 200)

    def test_add_child_to_family(self):
        """Test adding a child to a family"""
        if not self.created_child_id or not self.created_family_id:
            print("❌ Skipped - Missing child or family ID")
            return False
            
        return self.run_test(
            "Add Child to Family",
            "POST",
            f"families/{self.created_family_id}/add-child/{self.created_child_id}",
            200
        )

    def test_child_stats(self):
        """Test getting child statistics"""
        if not self.created_child_id:
            print("❌ Skipped - No child ID available")
            return False
            
        return self.run_test(
            "Get Child Stats",
            "GET",
            f"stats/child/{self.created_child_id}",
            200
        )

    def test_leaderboard(self):
        """Test getting the leaderboard"""
        return self.run_test("Get Leaderboard", "GET", "leaderboard", 200)

    def test_family_coaching(self):
        """Test family coaching with Claude-4"""
        if not self.created_family_id:
            print("❌ Skipped - No family ID available")
            return False
            
        print("   ⚠️  This test may take 10-30 seconds due to AI processing...")
        return self.run_test(
            "Family Coaching (Claude-4)",
            "GET",
            f"coaching/{self.created_family_id}",
            200,
            timeout=60  # Longer timeout for AI
        )

def main():
    print("🚀 Starting OFF Application API Tests")
    print("=" * 50)
    
    tester = OFFAPITester()
    
    # Test sequence
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Create Child", tester.test_create_child),
        ("Get All Children", tester.test_get_children),
        ("Get Child by ID", tester.test_get_child_by_id),
        ("Get All Challenges", tester.test_get_challenges),
        ("Create Manual Challenge", tester.test_create_challenge),
        ("AI Challenge Generation", tester.test_ai_challenge_generation),
        ("Complete Challenge", tester.test_complete_challenge),
        ("Create Family", tester.test_create_family),
        ("Get All Families", tester.test_get_families),
        ("Add Child to Family", tester.test_add_child_to_family),
        ("Get Child Stats", tester.test_child_stats),
        ("Get Leaderboard", tester.test_leaderboard),
        ("Family Coaching", tester.test_family_coaching),
    ]
    
    # Run all tests
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} - Unexpected error: {str(e)}")
        
        # Small delay between tests
        time.sleep(0.5)
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Backend is working correctly.")
        return 0
    else:
        failed = tester.tests_run - tester.tests_passed
        print(f"⚠️  {failed} test(s) failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())