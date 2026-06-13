from fastapi import APIRouter
from random import choice
import requests

router = APIRouter(
    prefix="/send",
    tags=["Messaging"]
)


@router.post("")
def send_message():

    status = choice([
        "DELIVERED",
        "OPENED",
        "CLICKED",
        "FAILED",
        "READ"
    ])

    receipt = {
        "customer_id": 1,
        "campaign_id": 1,
        "status": status
    }

    try:
        requests.post(
            "http://127.0.0.1:8000/receipts",
            json=receipt
        )

    except Exception as e:
        print(
            f"Receipt callback failed: {e}"
        )

    return {
        "status": status
    }