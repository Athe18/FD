"""
Agentic AI Co-Pilot API Endpoints
=================================
"""

from fastapi import APIRouter
from typing import Dict, Any
from pydantic import BaseModel
from app.ai.supervisor import supervisor

router = APIRouter(prefix="/ai", tags=["AI Co-Pilot & Explainability"])


class ChatMessage(BaseModel):
    message: str = "Why did Prabal recommend this consolidated block?"


@router.post("/chat")
def chat_copilot(payload: ChatMessage) -> Dict[str, Any]:
    return supervisor.handle_query(payload.message)
