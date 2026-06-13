from fastapi import APIRouter

from app.services.channel_service import (
    send_to_channel_service
)

router = APIRouter(
    prefix="/campaigns",
    tags=["Campaigns"]
)


@router.post("/send")
def send_campaign():

    result = send_to_channel_service()

    return {
        "campaign_status": result
    }