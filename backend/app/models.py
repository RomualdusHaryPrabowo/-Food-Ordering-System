from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#Setup dasar SQLAlchemy
Base = declarative_base()

#Tabel Users
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    role = Column(String(20), default="customer") # customer / owner
    email = Column(String(100), unique=True)

#Fungsi untuk membuat database fisik
def init_db(db_url='sqlite:///food_ordering.db'):
    engine = create_engine(db_url)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine)()