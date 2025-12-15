from sqlalchemy import create_engine
from models import DBSession, User, Menu, setup_db
import transaction
import bcrypt


DB_URL = 'postgresql://postgres:h4p0r0m.ceo8@localhost:5432/food_order_db'

def seed_data():
    engine = create_engine(DB_URL)
    DBSession.configure(bind=engine)
    setup_db(engine)

    #Seed user
    if not DBSession.query(User).filter(User.email == 'owner@food.com').first():
        pw = bcrypt.hashpw('123456'.encode('utf-8'), bcrypt.gensalt())
        DBSession.add(User(name='Pak Bos', email='owner@food.com', password=pw.decode('utf-8'), role='owner'))
        print("User Owner berhasil dibuat.")
    
    if not DBSession.query(User).filter(User.email == 'budi@mail.com').first():
        pw = bcrypt.hashpw('123456'.encode('utf-8'), bcrypt.gensalt())
        DBSession.add(User(name='Budi', email='budi@mail.com', password=pw.decode('utf-8'), role='customer'))
        print("User Customer berhasil dibuat.")

    #Seed menu
    if DBSession.query(Menu).count() == 0:
        menu1 = Menu(name='Nasi Goreng Spesial', price=25000, category='Makanan', image_url='https://via.placeholder.com/150', is_available=1)
        menu2 = Menu(name='Es Teh Manis', price=5000, category='Minuman', image_url='https://via.placeholder.com/150', is_available=1)
        menu3 = Menu(name='Ayam Bakar Madu', price=30000, category='Makanan', image_url='https://via.placeholder.com/150', is_available=1)
        
        DBSession.add(menu1)
        DBSession.add(menu2)
        DBSession.add(menu3)
        print("3 Menu Contoh berhasil ditambahkan!") #testing
    else:
        print("Data Menu sudah ada.")

    transaction.commit()

if __name__ == '__main__':
    seed_data()