from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from datetime import datetime

from app.db.database import Base


class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.id")
    )

    amount = Column(Float)

    category = Column(String)

    order_date = Column(
        DateTime,
        default=datetime.utcnow
    )