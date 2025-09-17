from fastapi import APIRouter
from app.api.endpoints import tickets, analytics

api_router = APIRouter()
api_router.include_router(tickets.router, prefix="/tickets", tags=["Tickets"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])