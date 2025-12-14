from pyramid.view import view_config
from .models import init_db, User

#Inisialisasi DB
session = init_db()

@view_config(route_name='health', renderer='json')
def health_check(request):
    return {
        "status": "ok", 
        "database": "connected",
        "service": "Food Ordering Backend"
    }

#Mengambil data user (Simulasi)
@view_config(route_name='users', renderer='json')
def get_users(request):
    # Logika dummy untuk mengambil data user
    dummy_data = [
        {"id": 1, "name": "Budi (Ketua Tim)", "role": "admin"},
        {"id": 2, "name": "Siti (User)", "role": "customer"},
    ]
    return {
        "total": len(dummy_data),
        "data": dummy_data
    }