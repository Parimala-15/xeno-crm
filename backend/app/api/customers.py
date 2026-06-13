from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.customer import Customer

from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse
)

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post(
    "",
    response_model=CustomerResponse
)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    db_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
        city=customer.city
    )

    db.add(db_customer)

    db.commit()

    db.refresh(db_customer)

    return db_customer


@router.get("")
def get_customers(
    db: Session = Depends(get_db)
):

    return db.query(Customer).all()