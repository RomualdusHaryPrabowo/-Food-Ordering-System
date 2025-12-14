from pyramid.view import view_config
from .models import init_db, User
import jwt
import datetime
import os

SECRET_KEY = "rahasia_dapur_mama" #rubah menjadi evngit commit -m "feat(auth): implement user registration logic"
session = init_db()

@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    try:
        data = request.json_body
        # Cek email kembar
        if session.query(User).filter_by(email=data['email']).first():
            request.response.status = 400
            return {"error": "Email sudah terdaftar!"}

        new_user = User(
            name=data['name'],
            email=data['email'],
            role=data.get('role', 'customer')
        )
        new_user.set_password(data['password'])

        session.add(new_user)
        session.commit()
        return {"message": "Registrasi berhasil", "email": new_user.email}
    except Exception as e:
        request.response.status = 500
        return {"error": str(e)}
      

@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    data = request.json_body
    user = session.query(User).filter_by(email=data.get('email')).first()

    # Cek Password
    if user and user.check_password(data.get('password')):
        # Buat Tiket (Token)
        payload = {
            'sub': user.id,
            'name': user.name,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return {
            "token": token,
            "user": {"id": user.id, "name": user.name, "role": user.role}
        }

    request.response.status = 401
    return {"error": "Email atau Password salah"}