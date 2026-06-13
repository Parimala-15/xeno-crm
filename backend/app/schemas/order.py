from pydantic import BaseModel


class OrderCreate(BaseModel):

    customer_id: int
    amount: float
    category: str


class OrderResponse(BaseModel):

    id: int
    customer_id: int
    amount: float
    category: str

    class Config:
        from_attributes = True