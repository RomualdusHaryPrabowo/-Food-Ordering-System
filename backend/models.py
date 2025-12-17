from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,       
    DateTime,     
    ForeignKey,   
)

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    relationship  
)

from zope.sqlalchemy import register
from datetime import datetime  

#Setup database
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
    
    created_at = Column(DateTime, default=datetime.utcnow)

    #Fungsi helper untuk mengubah data ke JSON (biar bisa dikirim ke Frontend)
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
        
class Order(Base):
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True)
    
    #Relasi ke tabel User
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    total_price = Column(Integer, nullable=False)
    status = Column(Text, default='pending')  #Pilihan: 'pending', 'completed', 'canceled'
    
    #Mencatat waktu otomatis saat data dibuat
    created_at = Column(DateTime, default=datetime.utcnow)

    #Relasi: Memberitahu Python bahwa Order ini milik seorang User
    user = relationship("User", backref="orders")

    #Fungsi untuk mengubah data tabel menjadi JSON
    def to_json(self):
        return {
            'id': self.id,
            'user_name': self.user.name, 
            'total_price': self.total_price,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M'),
        }

class OrderItem(Base):
    __tablename__ = 'order_items'
    
    id = Column(Integer, primary_key=True)
    
    #Menghubungkan item ke struk induk (Order)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    
    #Menghubungkan item ke menu asli
    menu_id = Column(Integer, ForeignKey('menus.id'), nullable=False)
    
    quantity = Column(Integer, nullable=False) #Jumlah beli
    price_at_purchase = Column(Integer, nullable=False) #Harga saat pembelian

   
    order = relationship("Order", backref="items")
    menu = relationship("Menu")

    def to_json(self):
        return {
            'menu_name': self.menu.name,
            'quantity': self.quantity,
            'price': self.price_at_purchase
        }

#Fungsi inisialisasi tabel
def setup_db(engine):
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)