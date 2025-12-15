from sqlalchemy import Column, Integer, Text, DateTime, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import register
import datetime


DBSession = scoped_session(sessionmaker())
register(DBSession)
Base = declarative_base()

#Tabel user
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(Text, nullable=False) # Disimpan dalam bentuk ter-enkripsi
    role = Column(Text, default='customer') # Pilihan: 'customer' atau 'owner'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Fungsi helper untuk mengubah data ke JSON (biar bisa dikirim ke Frontend)
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role
        }

#Tabel menu
class Menu(Base):
    __tablename__ = 'menus'

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    category = Column(Text, nullable=False) #Makanan / Minuman
    image_url = Column(Text, nullable=True) #Link gambar
    is_available = Column(Integer, default=1) #1 = Ada, 0 = Habis
    
    #Fungsi helper untuk mengubah data ke JSON (biar bisa dikirim ke Frontend)
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'category': self.category,
            'image_url': self.image_url,
            'is_available': bool(self.is_available)
        }

# Fungsi inisialisasi tabel
def setup_db(engine):
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)