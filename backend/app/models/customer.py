from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import DateTime

from datetime import datetime

from app.db.database import Base


class Customer(Base):

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True)

    phone = Column(String)

    city = Column(String)

    total_spend = Column(Float, default=0)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )