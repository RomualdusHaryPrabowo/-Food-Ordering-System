import React, { useEffect, useState } from 'react';
import api from '../api/axios'; // Import axios instance yang sudah disetup
import './Menu.css';

const Menu = () => {
    //State untuk menyimpan data menu
    const [menus, setMenus] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

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
    }, []);

    //Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>Daftar Menu</h1>
                <div className="user-info">
                    <span>Halo, <b>{user ? user.name : 'Pengunjung'}</b></span>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
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
                            <button className="btn-order">Pesan</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;