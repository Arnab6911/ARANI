from fastapi import APIRouter, HTTPException
from app.services import firestore_service

router = APIRouter()

@router.get("/dashboard-data")
def get_dashboard_data():
    try:
        return firestore_service.get_dashboard_analytics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))