from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM integrations
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

def get_gpt5_chat():
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id="challenge_generator",
        system_message="Tu es Nimo, la mascotte OFF qui aide les enfants à découvrir des aventures déconnectées ! Tu créés des défis personnalisés, créatifs et amusants qui utilisent le prénom de l'enfant pour rendre l'activité plus engageante. Ton ton est positif, encourageant et jamais moralisateur. Tu dis 'viens jouer dehors, ça va être génial !' plutôt que 'il faut couper les écrans'. Réponds toujours en français avec enthousiasme."
    ).with_model("openai", "gpt-5")

def get_claude4_chat():
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id="family_coach",
        system_message="Tu es un coach familial spécialisé dans la dynamique familiale et l'équilibre numérique. Tu aides les familles à créer des liens plus forts et à développer de saines habitudes numériques. Réponds toujours en français."
    ).with_model("anthropic", "claude-4-sonnet-20250514")

def get_gemini_chat():
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id="education_advisor",
        system_message="Tu es un conseiller pédagogique spécialisé dans les activités éducatives et familiales. Tu recommandes des activités enrichissantes et appropriées pour chaque âge. Réponds toujours en français."
    ).with_model("gemini", "gemini-2.5-pro")

# Define Models
class Child(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: int
    interests: List[str] = []
    screen_time_goal: int = 60  # minutes per day
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Challenge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # reading, outdoor, creative, family, sport, learning
    age_range: List[int]  # [min_age, max_age]
    duration_minutes: int
    fun_credits: int
    difficulty: str  # easy, medium, hard
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CompletedChallenge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    child_id: str
    challenge_id: str
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    fun_credits_earned: int
    validation_method: str = "parent"  # parent, photo, self

class Family(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    children: List[str] = []  # child IDs
    total_fun_credits: int = 0
    weekly_screen_time: int = 0  # minutes
    weekly_real_time: int = 0   # minutes  
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Leaderboard(BaseModel):
    family_id: str
    family_name: str
    total_credits: int
    weekly_challenges: int
    rank: int

# Input Models
class ChildCreate(BaseModel):
    name: str
    age: int
    interests: List[str] = []
    screen_time_goal: int = 60

class ChallengeCreate(BaseModel):
    title: str
    description: str
    category: str
    age_range: List[int]
    duration_minutes: int
    fun_credits: int
    difficulty: str

class FamilyCreate(BaseModel):
    name: str

class CompleteChallengeRequest(BaseModel):
    child_id: str
    challenge_id: str
    validation_method: str = "parent"

class GenerateChallengeRequest(BaseModel):
    child_id: str
    category: Optional[str] = None

# Helper functions
def prepare_for_mongo(data):
    if isinstance(data, dict):
        if 'created_at' in data and isinstance(data['created_at'], datetime):
            data['created_at'] = data['created_at'].isoformat()
    return data

def parse_from_mongo(item):
    if isinstance(item, dict):
        if 'created_at' in item and isinstance(item['created_at'], str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
        if 'completed_at' in item and isinstance(item['completed_at'], str):
            item['completed_at'] = datetime.fromisoformat(item['completed_at'])
    return item

# Routes

@api_router.get("/")
async def root():
    return {"message": "Bienvenue sur OFF - L'app qui rallume la vraie vie!"}

# Child routes
@api_router.post("/children", response_model=Child)
async def create_child(child_data: ChildCreate):
    child = Child(**child_data.dict())
    child_dict = prepare_for_mongo(child.dict())
    await db.children.insert_one(child_dict)
    return child

@api_router.get("/children", response_model=List[Child])
async def get_children():
    children = await db.children.find().to_list(1000)
    return [Child(**parse_from_mongo(child)) for child in children]

@api_router.get("/children/{child_id}", response_model=Child)
async def get_child(child_id: str):
    child = await db.children.find_one({"id": child_id})
    if not child:
        raise HTTPException(status_code=404, detail="Enfant non trouvé")
    return Child(**parse_from_mongo(child))

# Challenge routes
@api_router.post("/challenges", response_model=Challenge)
async def create_challenge(challenge_data: ChallengeCreate):
    challenge = Challenge(**challenge_data.dict())
    challenge_dict = prepare_for_mongo(challenge.dict())
    await db.challenges.insert_one(challenge_dict)
    return challenge

@api_router.get("/challenges", response_model=List[Challenge])
async def get_challenges(age: Optional[int] = None, category: Optional[str] = None):
    query = {}
    if age:
        query["age_range.0"] = {"$lte": age}
        query["age_range.1"] = {"$gte": age}
    if category:
        query["category"] = category
        
    challenges = await db.challenges.find(query).to_list(1000)
    return [Challenge(**parse_from_mongo(challenge)) for challenge in challenges]

@api_router.get("/challenges/{challenge_id}", response_model=Challenge)
async def get_challenge(challenge_id: str):
    challenge = await db.challenges.find_one({"id": challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Défi non trouvé")
    return Challenge(**parse_from_mongo(challenge))

# AI-generated challenges
@api_router.post("/challenges/generate")
async def generate_challenge(request: GenerateChallengeRequest):
    try:
        # Get child info
        child = await db.children.find_one({"id": request.child_id})
        if not child:
            raise HTTPException(status_code=404, detail="Enfant non trouvé")
        
        child_obj = Child(**parse_from_mongo(child))
        
        # Generate challenge with AI
        gpt5_chat = get_gpt5_chat()
        
        prompt = f"""Crée un défi personnalisé pour {child_obj.name}, {child_obj.age} ans.
        Intérêts: {', '.join(child_obj.interests) if child_obj.interests else 'activités variées'}
        Catégorie souhaitée: {request.category or 'libre choix'}
        
        Réponds UNIQUEMENT avec ce format JSON:
        {{
            "title": "titre accrocheur du défi",
            "description": "description détaillée et motivante",
            "category": "reading/outdoor/creative/family/sport/learning",
            "duration_minutes": nombre_entier,
            "difficulty": "easy/medium/hard"
        }}
        """
        
        user_message = UserMessage(text=prompt)
        response = await gpt5_chat.send_message(user_message)
        
        # Parse AI response and create challenge
        import json
        try:
            ai_data = json.loads(response.strip())
            
            # Calculate fun credits based on difficulty and duration
            base_credits = max(10, ai_data.get("duration_minutes", 30) // 10)
            difficulty_multiplier = {"easy": 1, "medium": 1.5, "hard": 2}
            fun_credits = int(base_credits * difficulty_multiplier.get(ai_data.get("difficulty", "easy"), 1))
            
            challenge = Challenge(
                title=ai_data["title"],
                description=ai_data["description"],
                category=ai_data["category"],
                age_range=[max(1, child_obj.age - 2), child_obj.age + 3],
                duration_minutes=ai_data["duration_minutes"],
                difficulty=ai_data["difficulty"],
                fun_credits=fun_credits
            )
            
            # Save to database
            challenge_dict = prepare_for_mongo(challenge.dict())
            await db.challenges.insert_one(challenge_dict)
            
            return challenge
            
        except json.JSONDecodeError:
            # Fallback challenge if AI response is malformed
            fallback_challenge = Challenge(
                title=f"Défi spécial pour {child_obj.name}",
                description="Passe 30 minutes à faire une activité que tu aimes sans écran!",
                category="creative",
                age_range=[child_obj.age - 2, child_obj.age + 3],
                duration_minutes=30,
                difficulty="easy",
                fun_credits=20
            )
            
            challenge_dict = prepare_for_mongo(fallback_challenge.dict())
            await db.challenges.insert_one(challenge_dict)
            return fallback_challenge
            
    except Exception as e:
        logging.error(f"Error generating challenge: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la génération du défi")

# Complete challenge
@api_router.post("/challenges/complete", response_model=CompletedChallenge)
async def complete_challenge(request: CompleteChallengeRequest):
    # Verify child and challenge exist
    child = await db.children.find_one({"id": request.child_id})
    if not child:
        raise HTTPException(status_code=404, detail="Enfant non trouvé")
        
    challenge = await db.challenges.find_one({"id": request.challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Défi non trouvé")
    
    challenge_obj = Challenge(**parse_from_mongo(challenge))
    
    # Create completed challenge
    completed = CompletedChallenge(
        child_id=request.child_id,
        challenge_id=request.challenge_id,
        fun_credits_earned=challenge_obj.fun_credits,
        validation_method=request.validation_method
    )
    
    completed_dict = prepare_for_mongo(completed.dict())
    await db.completed_challenges.insert_one(completed_dict)
    
    return completed

# Family routes
@api_router.post("/families", response_model=Family)
async def create_family(family_data: FamilyCreate):
    family = Family(**family_data.dict())
    family_dict = prepare_for_mongo(family.dict())
    await db.families.insert_one(family_dict)
    return family

@api_router.get("/families", response_model=List[Family])
async def get_families():
    families = await db.families.find().to_list(1000)
    return [Family(**parse_from_mongo(family)) for family in families]

@api_router.get("/families/{family_id}", response_model=Family)
async def get_family(family_id: str):
    family = await db.families.find_one({"id": family_id})
    if not family:
        raise HTTPException(status_code=404, detail="Famille non trouvée")
    return Family(**parse_from_mongo(family))

@api_router.post("/families/{family_id}/add-child/{child_id}")
async def add_child_to_family(family_id: str, child_id: str):
    family = await db.families.find_one({"id": family_id})
    if not family:
        raise HTTPException(status_code=404, detail="Famille non trouvée")
        
    child = await db.children.find_one({"id": child_id})
    if not child:
        raise HTTPException(status_code=404, detail="Enfant non trouvé")
    
    # Add child to family if not already there
    if child_id not in family.get("children", []):
        await db.families.update_one(
            {"id": family_id},
            {"$push": {"children": child_id}}
        )
    
    return {"message": "Enfant ajouté à la famille"}

# Stats and leaderboard
@api_router.get("/stats/child/{child_id}")
async def get_child_stats(child_id: str):
    # Get completed challenges for this child
    completed = await db.completed_challenges.find({"child_id": child_id}).to_list(1000)
    
    total_credits = sum(c.get("fun_credits_earned", 0) for c in completed)
    total_challenges = len(completed)
    
    # Categories breakdown
    categories = {}
    for c in completed:
        challenge = await db.challenges.find_one({"id": c["challenge_id"]})
        if challenge:
            category = challenge.get("category", "other")
            categories[category] = categories.get(category, 0) + 1
    
    # Clean recent challenges data to avoid ObjectId issues
    recent_challenges = []
    for c in completed[-5:] if completed else []:
        clean_challenge = {
            "id": c.get("id"),
            "child_id": c.get("child_id"),
            "challenge_id": c.get("challenge_id"),
            "completed_at": c.get("completed_at"),
            "fun_credits_earned": c.get("fun_credits_earned"),
            "validation_method": c.get("validation_method")
        }
        recent_challenges.append(clean_challenge)
    
    return {
        "child_id": child_id,
        "total_fun_credits": total_credits,
        "total_challenges_completed": total_challenges,
        "categories_breakdown": categories,
        "recent_challenges": recent_challenges
    }

@api_router.get("/leaderboard", response_model=List[Leaderboard])
async def get_leaderboard():
    families = await db.families.find().to_list(1000)
    leaderboard_data = []
    
    for family in families:
        family_obj = Family(**parse_from_mongo(family))
        
        # Calculate total credits for family
        total_credits = 0
        weekly_challenges = 0
        
        for child_id in family_obj.children:
            completed = await db.completed_challenges.find({"child_id": child_id}).to_list(1000)
            total_credits += sum(c.get("fun_credits_earned", 0) for c in completed)
            
            # Count challenges from last 7 days
            from datetime import timedelta
            week_ago = datetime.now(timezone.utc) - timedelta(days=7)
            recent_completed = []
            for c in completed:
                try:
                    completed_at = c["completed_at"]
                    if isinstance(completed_at, str):
                        completed_at = datetime.fromisoformat(completed_at)
                    elif isinstance(completed_at, datetime):
                        pass  # Already a datetime object
                    else:
                        continue  # Skip invalid dates
                    
                    # Ensure timezone compatibility
                    if completed_at.tzinfo is None:
                        completed_at = completed_at.replace(tzinfo=timezone.utc)
                    
                    if completed_at > week_ago:
                        recent_completed.append(c)
                except (ValueError, KeyError, TypeError):
                    continue  # Skip invalid entries
            weekly_challenges += len(recent_completed)
        
        leaderboard_data.append({
            "family_id": family_obj.id,
            "family_name": family_obj.name,
            "total_credits": total_credits,
            "weekly_challenges": weekly_challenges
        })
    
    # Sort by total credits descending
    leaderboard_data.sort(key=lambda x: x["total_credits"], reverse=True)
    
    # Add ranks
    for i, entry in enumerate(leaderboard_data):
        entry["rank"] = i + 1
    
    return [Leaderboard(**entry) for entry in leaderboard_data]

# Family coaching with AI
@api_router.get("/coaching/{family_id}")
async def get_family_coaching(family_id: str):
    try:
        family = await db.families.find_one({"id": family_id})
        if not family:
            raise HTTPException(status_code=404, detail="Famille non trouvée")
        
        family_obj = Family(**parse_from_mongo(family))
        
        # Get family stats
        children_data = []
        for child_id in family_obj.children:
            child = await db.children.find_one({"id": child_id})
            completed = await db.completed_challenges.find({"child_id": child_id}).to_list(1000)
            
            if child:
                children_data.append({
                    "name": child["name"],
                    "age": child["age"],
                    "challenges_completed": len(completed),
                    "total_credits": sum(c.get("fun_credits_earned", 0) for c in completed)
                })
        
        # Generate coaching advice with Claude
        claude_chat = get_claude4_chat()
        
        prompt = f"""Analyse cette famille et donne des conseils personnalisés:
        
        Famille: {family_obj.name}
        Enfants: {children_data}
        
        Donne 3 conseils concrets pour:
        1. Améliorer l'équilibre numérique
        2. Renforcer les liens familiaux  
        3. Motiver les enfants dans leurs défis
        
        Réponds en français, de façon chaleureuse et encourageante."""
        
        user_message = UserMessage(text=prompt)
        response = await claude_chat.send_message(user_message)
        
        return {
            "family_id": family_id,
            "coaching_advice": response,
            "family_stats": {
                "total_children": len(children_data),
                "total_challenges": sum(c["challenges_completed"] for c in children_data),
                "total_credits": sum(c["total_credits"] for c in children_data)
            }
        }
        
    except Exception as e:
        logging.error(f"Error generating coaching: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la génération des conseils")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()