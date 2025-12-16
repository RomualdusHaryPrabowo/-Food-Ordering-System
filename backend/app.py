from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.events import NewRequest
from sqlalchemy import create_engine
import jwt
import datetime
import bcrypt

#Import from models
from models import DBSession, User, Menu, setup_db


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

#Logika registrasi
def register(request):
    try:
        #Mengambil data input
        params = request.json_body
        name = params.get('name')
        email = params.get('email')
        password = params.get('password')
        role = params.get('role', 'customer') 

        #Validasi input
        if not email or not password:
            request.response.status = 400
            return {'status': 'error', 'message': 'Email dan Password wajib diisi'}

        #Pengecekan apaakah email sudah terdaftar
        existing_user = DBSession.query(User).filter(User.email == email).first()
        if existing_user:
            request.response.status = 400
            return {'status': 'error', 'message': 'Email sudah digunakan. Silahkan gunakan email lain.'}

        #Hashing password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        #Menyimpan user baru ke database
        new_user = User(name=name, email=email, password=hashed_password, role=role)
        DBSession.add(new_user)

        return {'status': 'success', 'message': 'Selamat! Registrasi berhasil.'}

    except Exception as e:
        print(f"Error Register: {e}")
        request.response.status = 500
        return {'status': 'error', 'message': 'Terjadi kesalahan server'}
    
#Logika mendapatkan daftar menu
def get_menus(request):
    if request.method == 'OPTIONS':
        return Response(status=200)
    try:
        #Mengambil data menu dari database
        menus = DBSession.query(Menu).all()
        
        #Mengubah data menu ke format JSON
        data_menu = [menu.to_json() for menu in menus]
        
        #Mengembalikan response
        return {
            'status': 'success',
            'data': data_menu
        }
        
    except Exception as e:
        print(f"Error Get Menu: {e}")
        request.response.status = 500
        return {'status': 'error', 'message': 'Gagal mengambil data menu'}

#Logika menambah menu
def add_menu(request):
        try:
            params = request.json_body
            new_menu = Menu(
                name=params['name'],
                category=params['category'],
                price=int(params['price']),
                image_url=params.get('image_url', 'https://placehold.co/150'),
                available=True
            )
            DBSession.add(new_menu)
            return {'status': 'success', 'message': 'Menu berhasil ditambahkan', 'data': new_menu.to_json()}
        except Exception as e:
            request.response.status = 500
            return {'status': 'error', 'message': str(e)}

#Logika menghapus menu
def delete_menu(request):
    menu_id = request.matchdict['id'] # Menangkap angka ID dari URL
    menu = DBSession.query(Menu).filter(Menu.id == menu_id).first()
    
    if not menu:
        request.response.status = 404
        return {'status': 'error', 'message': 'Menu tidak ditemukan'}
    
    DBSession.delete(menu)
    return {'status': 'success', 'message': 'Menu berhasil dihapus'}

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
        
        #Setup route menu
        config.add_route('menus', '/api/menus')
        config.add_view(get_menus, route_name='menus', renderer='json')

         #Setup route register
        config.add_route('register', '/api/register')
        config.add_view(register, route_name='register', renderer='json', request_method='POST')
        
        #Setup route tambah menu
        config.add_view(add_menu, route_name='menus', renderer='json', request_method='POST')

        #Setup route hapus menu
        config.add_route('menu_detail', '/api/menus/{id}') 
        config.add_view(delete_menu, route_name='menu_detail', renderer='json', request_method='DELETE')


    app = config.make_wsgi_app()
    print("Server Backend berjalan di http://localhost:6543")
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()
    
   