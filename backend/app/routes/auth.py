from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.database import get_connection
from app.utils.auth_helper import hash_password, verify_password, create_token, verify_token

router = APIRouter()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class OnboardingRequest(BaseModel):
    answers: list


@router.post("/signup")
def signup(data: SignupRequest):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE email = %s", (data.email,))
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(data.password)
    cur.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
        (data.name, data.email, hashed)
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    token = create_token(user_id)
    return {"token": token, "user_id": user_id, "name": data.name}

@router.post("/login")
def login(data: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, password_hash FROM users WHERE email = %s", (data.email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if not user or not verify_password(data.password, user[2]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user[0])
    return {"token": token, "user_id": user[0], "name": user[1]}

@router.get("/me")
def get_me(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No token")
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email FROM users WHERE id = %s", (payload["user_id"],))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return {"id": user[0], "name": user[1], "email": user[2]}

@router.post("/onboarding")
def save_onboarding(data: OnboardingRequest, authorization: str = Header(None)):
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Simple personality logic based on answers
    scores = {"impulsive": 0, "saver": 0, "planner": 0, "avoider": 0}
    for answer in data.answers:
        if answer == "A": scores["impulsive"] += 1
        elif answer == "B": scores["saver"] += 1
        elif answer == "C": scores["planner"] += 1
        elif answer == "D": scores["avoider"] += 1
    
    personality = max(scores, key=scores.get)
    personality_map = {
        "impulsive": "The Impulsive Spender",
        "saver": "The Cautious Saver",
        "planner": "The Smart Planner",
        "avoider": "The Money Avoider"
    }
    personality_type = personality_map[personality]
    
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE users SET personality_type = %s WHERE id = %s",
        (personality_type, payload["user_id"])
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"personality_type": personality_type}