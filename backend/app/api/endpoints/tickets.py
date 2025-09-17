from fastapi import APIRouter, HTTPException
from typing import List
from app.services import firestore_service
from app.models.ticket_models import Ticket, TicketCreate

router = APIRouter()

@router.post("/", response_model=Ticket, status_code=201)
def submit_new_ticket(ticket_in: TicketCreate):
    try:
        return firestore_service.create_ticket(ticket_in)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Ticket])
def get_all_tickets():
    try:
        return firestore_service.get_all_tickets()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{ticket_id}", response_model=Ticket)
def get_ticket(ticket_id: str):
    try:
        ticket = firestore_service.get_ticket_by_id(ticket_id)
        if ticket is None:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return ticket
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))