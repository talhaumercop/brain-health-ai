import os
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from agents import Agent, Runner, trace
from prompt import system_prompt
load_dotenv()

app = FastAPI(title="Brain Health Care API")

class UserRequest(BaseModel):
    text: str = Field(..., description="User's mental or emotional concern for AI analysis")

# CORS setup
cors_origins = [
    "http://localhost:3000",
    "http://frontend:3000",
]

if os.getenv("ENVIRONMENT") == "production":
    cors_origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BrainIssue(BaseModel):
    answer: str = Field(..., description="AI's comprehensive response to the user's concern")
    mindset_fix: str = Field(..., description="Suggested mindset adjustment")
    motivational_closing: str = Field(..., description="Motivational closing statement")
    zone: str = Field(..., description="Red, Yellow, or Green zone classification according to emotional state")
    score: float = Field(..., description="Wellness score from 0 to 100")

@app.post("/api/analyze")
async def analyze_request(request: UserRequest):
    """
    Analyze the user's request and generate a personalized, emotionally intelligent AI response.
    """
    try:
        with trace("Brain_Health_Care"):
            agent = Agent(
                name="Brain_Health_Care",
                instructions=system_prompt,
                model="gpt-4o-mini",
                output_type=BrainIssue,
            )

            # ✅ FIX: correct attribute
            result = await Runner.run(agent, input=request.text)

            # if not hasattr(result, "output"):
            #     raise ValueError("Runner returned invalid format")

            return {"analysis": result.final_output}

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail={"error": str(e)})

@app.get("/health")
async def health():
    return {"message": "Brain is healthy!"}

if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
