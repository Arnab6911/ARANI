from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class TicketCreate(BaseModel):
    issue_type: str = Field(..., example="Pothole")
    location_text: str = Field(..., example="New Town, Action Area II")
    description_raw: str = Field(..., example="There is a huge pothole...")
    citizenContact: str = Field(..., example="9876543210")


class Ticket(BaseModel):
    ticketId: str
    createdAt: datetime
    status: str
    issue_type: str
    location_text: str
    description_raw: str
    citizenContact: str
    # CHANGE THIS LINE
    assignedDepartmentIds: Optional[List[str]] = []
    ai_insights: Optional[Dict] = None
    updates: Optional[List[Dict]] = []