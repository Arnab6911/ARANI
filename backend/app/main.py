# In backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router

app = FastAPI(title="Project ARAÑI API")

# The list of allowed frontend URLs
# We are changing this back to a wildcard for debugging
origins = ["*"] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Use the simplified wildcard
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Hello ARAÑI Backend"}

app.include_router(api_router, prefix="/api/v1")