from fastapi import FastAPI
from app.api.ai import router as ai_router
from app.db.database import Base
from app.db.database import engine
from app.api.campaigns import (
    router as campaign_router
)
from app.api.receipts import router as receipt_router
from app.api.customers import router as customer_router
from app.api.orders import router as order_router
from fastapi.middleware.cors import CORSMiddleware
from app.models.customer import Customer
from app.models.order import Order

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Xeno CRM"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(ai_router)
app.include_router(
    campaign_router
)
app.include_router(receipt_router)
@app.get("/")
def root():

    return {
        "message": "Xeno CRM Running"
    }