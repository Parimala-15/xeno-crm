from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.order import Order

from app.models.customer import Customer

from app.schemas.order import OrderCreate

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):

    db_order = Order(
        customer_id=order.customer_id,
        amount=order.amount,
        category=order.category
    )

    db.add(db_order)

    customer = db.query(Customer).filter(
        Customer.id == order.customer_id
    ).first()

    if customer:
        customer.total_spend += order.amount

    db.commit()

    db.refresh(db_order)

    return db_order


@router.get("")
def get_orders(
    db: Session = Depends(get_db)
):

    return db.query(Order).all()