from sqlalchemy import Column, Integer, Text, DateTime, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import register
import datetime

# Setup Mesin Database
DBSession = scoped_session(sessionmaker())
register(DBSession)
Base = declarative_base()

# --- MODEL USER (TABEL PENGGUNA) ---
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

# Fungsi inisialisasi tabel
def setup_db(engine):
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)