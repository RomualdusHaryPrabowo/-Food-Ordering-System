from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.events import NewRequest
from sqlalchemy import create_engine
import jwt
import datetime
import bcrypt

#Import model dan setup database
from models import DBSession, User, setup_db


DB_URL = 'postgresql://postgres:h4p0r0m.ceo8@localhost:5432/food_order_db'
SECRET_KEY = "rahasia_kelompok_kita"

#cors headers
def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '1728000',
        })
    event.request.add_response_callback(cors_headers)

#Logika login
def login(request):
    #Handle preflight request
    if request.method == 'OPTIONS':
        return Response(status=200)

    try:
        #Mengambil data dari request
        data = request.json_body
        email = data.get('email')
        password = data.get('password')

        #Mencari user di database
        user = DBSession.query(User).filter(User.email == email).first()

        #Pengecekan password
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
        print(f"Error Login: {e}") #Log error untuk debugging
        request.response.status = 500
        return {'status': 'error', 'message': 'Internal Server Error'}

#Settup server
if __name__ == '__main__':
    #Setup database
    engine = create_engine(DB_URL)
    DBSession.configure(bind=engine)
    setup_db(engine)

    #Setup pyramid app
    with Configurator() as config:
        #Setup cors headers
        config.add_subscriber(add_cors_headers_response_callback, NewRequest)
        
        #Setup route login
        config.add_route('login', '/api/login')
        config.add_view(login, route_name='login', renderer='json') 


    app = config.make_wsgi_app()
    print("Server Backend berjalan di http://localhost:6543")
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()