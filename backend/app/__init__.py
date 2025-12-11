from pyramid.config import Configurator
from pyramid.renderers import JSON

def main(global_config, **settings):
    with Configurator(settings=settings) as config:
        # 1. Setup agar output bisa berupa JSON (data teks)
        config.add_renderer('json', JSON())
        
        # 2. Setup CORS Manual (Pengganti library yang error tadi)
        config.add_subscriber(add_cors_headers_response_callback, 'pyramid.events.NewResponse')

        # 3. Daftarkan Alamat URL
        config.add_route('health', '/api/health')
        
        # 4. Scan folder ini untuk mencari file logika
        config.scan('.views')
        
        return config.make_wsgi_app()

# Fungsi bantuan agar browser tidak memblokir koneksi (CORS)
def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        })
    event.request.add_response_callback(cors_headers)