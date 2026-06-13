from sqlalchemy import Column,Integer,String,DateTime
from app.db.database import Base

class Communication(Base):

    __tablename__ = "communications"

    id = Column(Integer,primary_key=True,index=True)

    campaign_id = Column(Integer)

    customer_id = Column(Integer)

    status = Column(String)

    sent_at = Column(DateTime)

    opened_at = Column(DateTime)

    clicked_at = Column(DateTime)