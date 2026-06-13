from fastapi import APIRouter

router = APIRouter(
    prefix="/receipts",
    tags=["Receipts"]
)

receipts = []


@router.post("")
def receive_receipt(data: dict):

    receipts.append(data)

    return {
        "message": "Receipt Received"
    }


@router.get("")
def get_receipts():

    return receipts