from pyramid.config import Configurator
from pyramid.renderers import JSON

def main(global_config, **settings):
    with Configurator(settings=settings) as config:
        config.add_renderer('json', JSON())
        config.add_subscriber(add_cors_headers_response_callback, 'pyramid.events.NewResponse')

        #auth routes
        config.add_route('health', '/api/health')
        config.add_route('users', '/api/users')
        config.add_route('register', '/api/register')
        config.add_route('login', '/api/login')

        #menu routes
        config.add_route('menu_list', '/api/menus') #Get
        config.add_route('menu_add', '/api/menus/add') #Post
        config.add_route('menu_delete', '/api/menus/{id}') #Delete

        #scan seluruh file views dan auth
        config.scan('.views')       # Scan views.py
        config.scan('.auth')        # Scan auth.py
        config.scan('.menu_views')  # Scan menu_views.py

        return config.make_wsgi_app()

def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        })
    event.request.add_response_callback(cors_headers)