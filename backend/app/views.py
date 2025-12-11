from pyramid.view import view_config

# Jika ada orang akses /api/health, jalankan fungsi ini:
@view_config(route_name='health', renderer='json')
def health_check(request):
    return {
        "status": "ok", 
        "project": "Digit 2 - Food Order",
        "message": "Backend Pyramid Berhasil Jalan!"
    }