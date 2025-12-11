from app import main
from waitress import serve
import os

if __name__ == '__main__':
    settings = {}
    app = main({}, **settings)
    
    port = 6543
    print("==================================================")
    print(f" SERVER BERJALAN DI: http://localhost:{port}")
    print(f" CEK HEALTH: http://localhost:{port}/api/health")
    print("==================================================")
    serve(app, host='0.0.0.0', port=port)