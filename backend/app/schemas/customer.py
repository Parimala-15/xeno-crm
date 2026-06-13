from pydantic import BaseModel


class CustomerCreate(BaseModel):

    name: str
    email: str
    phone: str
    city: str


class CustomerResponse(BaseModel):

    id: int
    name: str
    email: str
    phone: str
    city: str
    total_spend: float

    class Config:
        from_attributes = True