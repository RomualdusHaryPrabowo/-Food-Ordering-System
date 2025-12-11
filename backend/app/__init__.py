from pyramid.config import Configurator
from pyramid.renderers import JSON

def main(global_config, **settings):
    #Membuka konfigurasi server
    with Configurator(settings=settings) as config:

        #Setup, untuk data keluar sebagai teks (JSON)
        config.add_renderer('json', JSON())

        #Setup CORS
        config.add_subscriber(add_cors_headers_response_callback, 'pyramid.events.NewResponse')

        #Daftar alamat url
        #Alamat lama
        config.add_route('health', '/api/health')

        #Alamat BARU
        #Jika ada yang akses "/api/users", beri nama rute jadi users
        config.add_route('users', '/api/users') 

        #mencari file views.py untuk menjalankan logika
        config.scan('.views')

        return config.make_wsgi_app()

# Fungsi untuk izin akses
def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        })
    event.request.add_response_callback(cors_headers)