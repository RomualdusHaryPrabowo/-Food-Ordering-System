from pyramid.view import view_config
from .models import init_db, MenuItem

session = init_db()

#Lihat daftar menu
@view_config(route_name='menu_list', renderer='json', request_method='GET')
def get_menus(request):
    # Fitur filtering berdasarkan kategori
    category = request.params.get('category')
    query = session.query(MenuItem)

    if category:
        query = query.filter(MenuItem.category == category)

    items = query.all()

    #merubah data menu ke format json
    return {
        "data": [
            {
                "id": i.id, 
                "name": i.name, 
                "price": i.price, 
                "category": i.category,
                "image": i.image_url,
                "available": i.is_available
            } 
            for i in items
        ]
    }