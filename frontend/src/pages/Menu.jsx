import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Import axios instance yang sudah disetup
import './Menu.css';

const Menu = () => {
    //State untuk menyimpan data menu
    const [menus, setMenus] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
   
    //Mengambil data menu dari backend
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                //Tampilan data dari endpoint /menus
                const response = await api.get('/menus');
                //Menyimpan data menu ke state
                setMenus(response.data.data);
            } catch (error) {
                console.error("Gagal ambil menu:", error);
                alert("Gagal mengambil data menu. Silakan coba lagi nanti.");
            }
        };

        fetchMenus();
        updateCartCount();
    }, []);

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
    };

    const handleAddToCart = (menu) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItemIndex = cart.findIndex(item => item.id === menu.id);
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                id: menu.id,
                name: menu.name,
                price: menu.price,
                category: menu.category,
                image_url: menu.image_url,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        alert(`${menu.name} ditambahkan ke keranjang!`);
    };

    const handleGoToCart = () => {
        navigate('/cart');
    };

    //Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        window.location.href = '/';
    };

    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>Daftar Menu</h1>
                <div className="header-actions">
                    <button onClick={handleGoToCart} className="btn-cart">
                        <i className="fas fa-shopping-cart"></i>
                        <span className="cart-badge">{cartCount}</span>
                        Keranjang
                    </button>
                    <div className="user-info">
                        <span>Halo, <b>{user ? user.name : 'Pengunjung'}</b></span>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </div>
                </div>
            </header>

            {/* Looping untuk menampilkan kartu menu */}
            <div className="menu-grid">
                {menus.map((menu) => (
                    <div key={menu.id} className="menu-card">
                       <img 
                            src={menu.image_url} 
                            alt={menu.name} 
                            className="menu-image" 
                            onError={(e) => {
                            e.target.onerror = null; //Menghentikan loop jika gambar gagal dimuat
                            e.target.src = 'https://placehold.co/150';
                            }} 
                         />
                        <div className="menu-details">
                            <span className="menu-category">{menu.category}</span>
                            <h3>{menu.name}</h3>
                            <p className="menu-price">Rp {menu.price.toLocaleString()}</p>
                            <button 
                                className="btn-add-cart"
                                onClick={() => handleAddToCart(menu)}
                            >
                                <i className="fas fa-cart-plus"></i> Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;