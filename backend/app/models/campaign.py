from sqlalchemy import Column,Integer,String,DateTime
from datetime import datetime
from app.db.database import Base

class Campaign(Base):

    __tablename__ = "campaigns"

    id = Column(Integer,primary_key=True,index=True)

    segment_id = Column(Integer)

    message = Column(String)

    channel = Column(String)

    status = Column(String,default="DRAFT")

    created_at = Column(DateTime,default=datetime.utcnow)