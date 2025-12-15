from sqlalchemy import create_engine
from models import DBSession, User, setup_db
import transaction
import bcrypt


DB_URL = 'postgresql://postgres:h4p0r0m.ceo8@localhost:5432/food_order_db'

def seed_data():
    engine = create_engine(DB_URL)
    DBSession.configure(bind=engine)
    setup_db(engine)

    #Pengecekan apakah user owner ada
    if DBSession.query(User).filter(User.email == 'owner@food.com').first():
        print("⚠️ User owner sudah ada. Skip.")
    else:
        #Membuat akun owner
        pw_hash = bcrypt.hashpw('123456'.encode('utf-8'), bcrypt.gensalt())
        owner = User(
            name='Pak Bos Owner',
            email='owner@food.com',
            password=pw_hash.decode('utf-8'),
            role='owner'
        )
        DBSession.add(owner)
        print("✅ User Owner dibuat: owner@food.com / 123456")

    #Pengecekan apakah user customer ada
    if DBSession.query(User).filter(User.email == 'budi@mail.com').first():
        print("⚠️ User customer sudah ada. Skip.")
    else:
        #Membuat akun customer
        pw_hash_cust = bcrypt.hashpw('123456'.encode('utf-8'), bcrypt.gensalt())
        customer = User(
            name='Budi Pembeli',
            email='budi@mail.com',
            password=pw_hash_cust.decode('utf-8'),
            role='customer'
        )
        DBSession.add(customer)
        print("✅ User Customer dibuat: budi@mail.com / 123456")

    transaction.commit()

if __name__ == '__main__':
    seed_data()