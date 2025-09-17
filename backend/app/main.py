from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router

app = FastAPI(title="Project ARAÑI API")

# Define the list of allowed frontend URLs
origins = [
    "http://localhost:5500",       # Your local VS Code Live Server
    "http://127.0.0.1:5500",      # Alternate local Live Server
    "https://arani1.netlify.app"   # <-- THE FIX IS HERE
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Use the specific list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Hello ARAÑI Backend"}

app.include_router(api_router, prefix="/api/v1")