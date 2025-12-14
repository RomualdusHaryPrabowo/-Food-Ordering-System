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
    
#Menambahkan menu baru
@view_config(route_name='menu_add', renderer='json', request_method='POST')
def add_menu(request):
    try:
        data = request.json_body

        new_item = MenuItem(
            name=data['name'],
            price=float(data['price']),
            category=data['category'],
            description=data.get('description', ''),
            image_url=data.get('image_url', ''), 
            is_available=True
        )

        session.add(new_item)
        session.commit()
        return {"message": "Menu berhasil ditambahkan", "id": new_item.id}
    except Exception as e:
        request.response.status = 500
        return {"error": str(e)}

#Menghapus menu berdasarkan ID
@view_config(route_name='menu_delete', renderer='json', request_method='DELETE')
def delete_menu(request):
    #Mengambil ID dari URL
    menu_id = request.matchdict['id']

    item = session.query(MenuItem).filter_by(id=menu_id).first()

    if item:
        session.delete(item)
        session.commit()
        return {"message": "Menu dihapus"}

    request.response.status = 404
    return {"error": "Menu tidak ditemukan"}