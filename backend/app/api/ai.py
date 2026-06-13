from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_service import (
    generate_segment,
    generate_campaign
)

router = APIRouter(
    prefix="/ai",
    tags=["AI Copilot"]
)


class SegmentRequest(BaseModel):
    prompt: str


class CampaignRequest(BaseModel):
    goal: str


@router.post("/segment")
def ai_segment(data: SegmentRequest):

    result = generate_segment(
        data.prompt
    )

    return {
        "success": True,
        "response": result
    }


@router.post("/campaign")
def ai_campaign(data: CampaignRequest):

    result = generate_campaign(
        data.goal
    )

    return {
        "success": True,
        "response": result
    }