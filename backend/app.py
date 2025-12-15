from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from sqlalchemy import create_engine
import jwt
import datetime
import bcrypt
import cornice

#Import model dan setup_db 
from models import DBSession, User, setup_db

#Konfigurasi
# GANTI 'password' dengan password PostgreSQL Anda!
DB_URL = 'postgresql://postgres:h4p0r0m.ceo8@localhost:5432/food_order_db'
SECRET_KEY = "rahasia_kelompok_kita"

#Logika login
def login(request):
    try:
        #Mengambil data dari request
        data = request.json_body
        email = data.get('email')
        password = data.get('password')

        #Mengecek user di database
        user = DBSession.query(User).filter(User.email == email).first()

        #Cek password
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            #Membuat token
            token_payload = {
                'sub': user.id,
                'name': user.name,
                'role': user.role,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
            }
            token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')

            return {
                'status': 'success',
                'token': token,
                'user': user.to_json()
            }
        else:
            request.response.status = 401
            return {'status': 'error', 'message': 'Email atau Password Salah!'}
            
    except Exception as e:
        request.response.status = 500
        print(f"Error: {e}")
        return {'status': 'error', 'message': 'Internal Server Error'}

#Settup server
if __name__ == '__main__':
    #Setup database
    engine = create_engine(DB_URL)
    DBSession.configure(bind=engine)
    setup_db(engine)

    #Setup Pyramid App
    with Configurator() as config:
        config.include('cornice') #Helper untuk API
        config.add_route('login', '/api/login')
        config.add_view(login, route_name='login', renderer='json', request_method='POST')
        
        #Mengizinkan CORS - agar bisa diakses dari frontend
        config.add_tween('cornice.tweens.cors_tween_factory')

    app = config.make_wsgi_app()
    print("🚀 Server Backend berjalan di http://localhost:6543")
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()